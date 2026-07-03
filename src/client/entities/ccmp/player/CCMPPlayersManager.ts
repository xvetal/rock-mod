/// <reference types="@classic-mp/types/client" />
import { type CCMPEventsManager } from "@RockMod/client/net/ccmp/events/CCMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IPlayer } from "../../common/player/IPlayer";
import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPPlayer } from "./CCMPPlayer";

interface ICCMPNativePlayer {
  readonly id: number;
  readonly name: string;
  readonly socialClub?: string;
}

/**
 * Реализация `IPlayersManager` под CCMP — single source of truth для
 * `IPlayer`-инстансов и `rm::playerReady`/`rm::playerConnected`-эмиссий
 * с настоящими `CCMPPlayer`-инстансами.
 *
 * ### Хранилище
 *
 * `Map<id, CCMPPlayer>`. For CCMP players only, `id` and `remoteId` still
 * mean the same server/network id. Non-player CCMP wrappers have a separate
 * client-local `id` and nullable server `remoteId`.
 * `findByID`/`findByRemoteID`/`findByRemoteId` map to one lookup for players.
 *
 * ### Жизненный цикл local player'а
 *
 * `ccmp.players.local` (backed by `op_get_local_player_id`) валиден сразу
 * после handshake'а — `PlayerManager::set_local_player_id` срабатывает до
 * того, как scripts загружаются. Мы используем его, чтобы синхронно
 * выпустить `rm::playerReady` как sticky-event (см. ниже):
 *
 *  1. **На конструкторе** — fast-path. Если local op возвращает игрока,
 *     эмитим `rm::playerReady` через `emitInternalSticky` с реальным
 *     `CCMPPlayer`-инстансом. Sticky-кэш гарантирует, что поздние
 *     подписчики из async DI-bootstrap'а геймода тоже получат сигнал
 *     при подписке.
 *  2. **На `connectionStateChanged`** — fallback / handler реконнекта.
 *     Если на конструкторе local ещё не был валиден (handshake race),
 *     `connected = true` запустит retry fast-path. На `connected = false`
 *     чистим _localPlayer и sticky-кэш, чтобы при следующем connect'е
 *     эмитнуть с актуальным remoteId.
 *
 * `CCMPPlayer`-инстанс важен (а не структурный stub) потому что
 * `RockModStateAdapter` в геймоде хранит `rockModPlayer`-ссылку и через
 * неё вызывает методы (`setNoCollision`, etc). На структурном stub'е
 * без методов это падало бы с `TypeError`.
 *
 * ### Remote-игроки
 *
 * Источники:
 *  - `ccmp.players.all` — prepopulation для уже-существующих на момент
 *    подключения (заполнен Rust'ом в `ClientScriptingService::init`).
 *  - `rm::playerConnected`/`rm::playerDisconnected` internal events
 *    (эмитит `CCMPEventsBridge` из нативных `ccmp.on('playerConnected'/...)`).
 */
export class CCMPPlayersManager implements IPlayersManager {
  private readonly _players = new Map<number, CCMPPlayer>();

  private readonly _events: CCMPEventsManager;

  private _localPlayer: CCMPPlayer | null = null;

  public constructor(events: CCMPEventsManager) {
    this._events = events;

    // 1) Subscribe ПЕРВЫМ — чтобы между подпиской и prepopulation'ом не
    // пропустить параллельный `rm::playerConnected`.
    this._events.onInternal({
      [ClientInternalEventName.PlayerReady]: (player: IPlayer): void => {
        // Если кто-то ещё эмитнул rm::playerReady (например, cooperation
        // fallback в будущем) — синхронизируем своё состояние.
        const remoteId = player.remoteId;
        if (remoteId === null) {
          return;
        }

        this._ensurePlayer(remoteId, player.name, /* isLocal */ true);
      },

      [ClientInternalEventName.PlayerConnected]: (player: IPlayer): void => {
        const remoteId = player.remoteId;
        if (remoteId === null) {
          return;
        }

        this._ensurePlayer(remoteId, player.name, /* isLocal */ false);
      },

      [ClientInternalEventName.PlayerDisconnected]: (player: IPlayer): void => {
        const remoteId = player.remoteId;
        if (remoteId === null) {
          return;
        }

        const existing = this._players.get(remoteId);
        if (existing) {
          existing.markRemoved();
          this._players.delete(remoteId);
        }
      },
    });

    this._registerNativePlayerEvents();

    // 2) Prepopulate уже-существующих remote-игроков из CCMP-runtime'а.
    // `ccmp.players.all` исключает local (см. js_runtime.rs::setup_globals).
    this._syncRemotePlayersFromRuntime();

    // 3) Fast-path: попытка эмитнуть rm::playerReady сразу. Если local не
    // готов (handshake ещё не отработал) — пропускаем, дальше connectionStateChanged
    // подберёт.
    this._tryEmitLocalPlayerReady();

    // 4) Retry-on-reconnect + reset-on-disconnect. Listener регистрируем
    // через `ccmp.on` напрямую (не через bridge), чтобы наша логика была
    // независимой от состояния других менеджеров.
    ccmp.on("connectionStateChanged", (state: { connected: boolean }): void => {
      if (state?.connected) {
        this._tryEmitLocalPlayerReady();
      } else {
        this._handleDisconnect();
      }
    });
  }

  // -- IPlayersManager ------------------------------------------------------

  public findLocalPlayer(): CCMPPlayer | null {
    // Кэшированный _localPlayer проставлен из rm::playerReady-эмиссии
    // (либо нашей собственной из конструктора, либо чьей-то ещё).
    // Если кэш пуст, lazy-retry: возможно local op теперь валиден.
    if (this._localPlayer) {
      return this._localPlayer;
    }
    this._tryEmitLocalPlayerReady();
    return this._localPlayer;
  }

  public getLocalPlayer(): CCMPPlayer {
    const player = this.findLocalPlayer();
    if (!player) {
      throw new Error("CCMPPlayersManager.getLocalPlayer: local player ещё не известен — handshake не завершён");
    }
    return player;
  }

  public findByRemoteId(remoteId: number): CCMPPlayer | null {
    return this._players.get(remoteId) ?? null;
  }

  public getByRemoteId(remoteId: number): CCMPPlayer {
    const player = this.findByRemoteId(remoteId);
    if (!player) {
      throw new Error(`CCMPPlayersManager.getByRemoteId: player remoteId=${remoteId} не найден`);
    }
    return player;
  }

  public findByName(name: string): CCMPPlayer | null {
    for (const player of this._players.values()) {
      if (player.name === name) {
        return player;
      }
    }
    return null;
  }

  public getByName(name: string): CCMPPlayer {
    const player = this.findByName(name);
    if (!player) {
      throw new Error(`CCMPPlayersManager.getByName: player name="${name}" не найден`);
    }
    return player;
  }

  // -- IEntitiesManager -----------------------------------------------------

  public syncWithMpPool(): void {
    this._syncRemotePlayersFromRuntime();
    this._syncLocalPlayerFromRuntime();
    this._tryEmitLocalPlayerReady();
  }

  public registerById(id: number): CCMPPlayer {
    // Под CCMP мы не можем "достать" игрока по id из глобального пула без
    // дополнительных данных (name, isLocal). Возвращаем существующего или
    // создаём минимальный stub. Корректный путь регистрации — через события.
    return this._ensurePlayer(id, /* name */ "", /* isLocal */ false);
  }

  public unregisterById(id: number): CCMPPlayer {
    return this.deleteById(id);
  }

  // -- IBaseObjectsManager / IWorldObjectsManager ---------------------------

  public findByID(id: number): CCMPPlayer | null {
    return this.findByRemoteId(id);
  }

  public getByID(id: number): CCMPPlayer {
    return this.getByRemoteId(id);
  }

  public findByRemoteID(remoteId: number): CCMPPlayer | null {
    return this.findByRemoteId(remoteId);
  }

  public getByRemoteID(remoteId: number): CCMPPlayer {
    return this.getByRemoteId(remoteId);
  }

  public deleteById(id: number): CCMPPlayer {
    const player = this.getByRemoteId(id);
    player.markRemoved();
    this._players.delete(id);
    if (this._localPlayer === player) {
      this._localPlayer = null;
      this._events.clearInternalSticky(ClientInternalEventName.PlayerReady);
    }
    return player;
  }

  public get iterator(): IWorldObjectsIterator<CCMPPlayer> {
    return this._iterator;
  }

  // -- Внутреннее -----------------------------------------------------------

  private _registerNativePlayerEvents(): void {
    ccmp.on("playerConnected", (ccmpPlayer: ICCMPNativePlayer): void => {
      const player = this._ensurePlayer(ccmpPlayer.id, ccmpPlayer.name ?? "", /* isLocal */ false);
      this._events.emitInternal(ClientInternalEventName.PlayerConnected, player);
    });

    ccmp.on("playerDisconnected", (ccmpPlayer: ICCMPNativePlayer): void => {
      const player =
        this._players.get(ccmpPlayer.id) ??
        this._ensurePlayer(ccmpPlayer.id, ccmpPlayer.name ?? "", /* isLocal */ false);

      player.markRemoved();
      this._players.delete(ccmpPlayer.id);
      if (this._localPlayer === player) {
        this._localPlayer = null;
        this._events.clearInternalSticky(ClientInternalEventName.PlayerReady);
      }
      this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
    });

    ccmp.on("playerStreamIn", (ccmpPlayer: ICCMPNativePlayer): void => {
      const player = this._ensurePlayer(ccmpPlayer.id, ccmpPlayer.name ?? "", /* isLocal */ false);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, player);
    });

    ccmp.on("playerStreamOut", (ccmpPlayer: ICCMPNativePlayer): void => {
      const player =
        this._players.get(ccmpPlayer.id) ??
        this._ensurePlayer(ccmpPlayer.id, ccmpPlayer.name ?? "", /* isLocal */ false);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, player);
    });
  }

  private _syncRemotePlayersFromRuntime(): void {
    try {
      for (const ccmpPlayer of ccmp.players.all as unknown as ICCMPNativePlayer[]) {
        this._ensurePlayer(ccmpPlayer.id, ccmpPlayer.name ?? "", /* isLocal */ false);
      }
    } catch (error) {
      console.warn("[CCMPPlayersManager] failed to sync from ccmp.players.all:", error);
    }
  }

  private _syncLocalPlayerFromRuntime(): void {
    let nativeLocal: ICCMPNativePlayer | null;
    try {
      nativeLocal = ccmp.players.local as unknown as ICCMPNativePlayer | null;
    } catch {
      return;
    }
    if (nativeLocal) {
      this._ensurePlayer(nativeLocal.id, nativeLocal.name ?? "", /* isLocal */ true);
    }
  }

  /**
   * Идемпотентная точка создания/обновления CCMPPlayer. Все источники
   * (events, prepopulation, fast-path) проходят сюда.
   */
  private _ensurePlayer(id: number, name: string, isLocal: boolean): CCMPPlayer {
    const existing = this._players.get(id);
    if (existing) {
      if (name) {
        existing.setNameInternal(name);
      }
      if (isLocal && !this._localPlayer) {
        this._localPlayer = existing;
      }
      return existing;
    }
    const player = new CCMPPlayer({
      id,
      name,
      isLocal,
    });
    this._players.set(id, player);
    if (isLocal) {
      this._localPlayer = player;
    }
    return player;
  }

  /**
   * Пытается синхронно достать local player из CCMP, создать CCMPPlayer
   * и эмитнуть rm::playerReady как sticky-event. Идемпотентна: повторный
   * вызов после успешной эмиссии — no-op (`_localPlayer !== null`).
   */
  private _tryEmitLocalPlayerReady(): void {
    if (this._localPlayer) {
      this._syncLocalPlayerFromRuntime();
      return;
    }

    let nativeLocal: ICCMPNativePlayer | null;
    try {
      nativeLocal = ccmp.players.local as unknown as ICCMPNativePlayer | null;
    } catch (error) {
      console.warn("[CCMPPlayersManager] ccmp.players.local read failed:", error);
      return;
    }
    if (!nativeLocal) {
      return;
    }

    const localPlayer = this._ensurePlayer(nativeLocal.id, nativeLocal.name ?? "", /* isLocal */ true);
    // Sticky: поздние подписчики из async DI-bootstrap'а геймода
    // (например `RockModMultiplayerEventsAdapter` из NetworkModule.init)
    // получат событие сразу при подписке.
    this._events.emitInternalSticky(ClientInternalEventName.PlayerReady, localPlayer);
  }

  private _handleDisconnect(): void {
    if (this._localPlayer) {
      this._localPlayer.markRemoved();
      this._players.delete(this._localPlayer.id);
      this._localPlayer = null;
    }
    // Чистим sticky-кэш — иначе новые подписчики после reconnect'а получат
    // устаревший local-player stub с прошлым remoteId.
    this._events.clearInternalSticky(ClientInternalEventName.PlayerReady);
  }

  // Iterator реализован inline — у CCMP нет per-dimension/per-range
  // фильтрации игроков на JS-уровне.
  private readonly _iterator: IWorldObjectsIterator<CCMPPlayer> = {
    all: (): IterableIterator<CCMPPlayer> => this._players.values(),
    dimension: (value: number): IterableIterator<CCMPPlayer> => this._iterateDimension(value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPPlayer> => this._iterateRange2D(center, range),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPPlayer> => this._iterateRange3D(center, range),
  };

  private *_iterateDimension(value: number): IterableIterator<CCMPPlayer> {
    for (const player of this._players.values()) {
      if (player.dimension === value) {
        yield player;
      }
    }
  }

  private *_iterateRange2D(center: Vector2D, range: number): IterableIterator<CCMPPlayer> {
    const squaredRange = range * range;
    for (const player of this._players.values()) {
      if (!player.isExists || player.handle === 0) {
        continue;
      }

      const position = player.position;
      const dx = position.x - center.x;
      const dy = position.y - center.y;
      if (dx * dx + dy * dy <= squaredRange) {
        yield player;
      }
    }
  }

  private *_iterateRange3D(center: Vector3D, range: number): IterableIterator<CCMPPlayer> {
    const squaredRange = range * range;
    for (const player of this._players.values()) {
      if (!player.isExists || player.handle === 0) {
        continue;
      }

      const position = player.position;
      const dx = position.x - center.x;
      const dy = position.y - center.y;
      const dz = position.z - center.z;
      if (dx * dx + dy * dy + dz * dz <= squaredRange) {
        yield player;
      }
    }
  }
}
