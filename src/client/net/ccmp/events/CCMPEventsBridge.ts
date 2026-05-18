/// <reference types="@classic-mp/types/client" />
import { ClientInternalEventName } from "../../common/events/types";
import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { type IPlayer } from "../../../entities/common";
import { type CCMPEventsManager } from "./CCMPEventsManager";

interface CCMPPlayerLike {
  readonly id: number;
  readonly name?: string;
}

/**
 * Связывает нативные CCMP события (`ccmp.on(...)`) с внутренней шиной
 * `rm::*`, на которую подписан геймод.
 *
 * ### Что НЕ обрабатывается тут (по задумке)
 *
 * **`rm::playerReady`** — single source of truth теперь `CCMPPlayersManager`.
 * Раньше bridge использовал cooperation `rm::clientReady`/server-response для
 * получения local remoteId, но `ccmp.players.local` (backed by
 * `op_get_local_player_id`) даёт ту же информацию синхронно сразу после
 * handshake'а — cooperation roundtrip только добавляет race conditions.
 * `CCMPPlayersManager` эмитит `rm::playerReady` через
 * `emitInternalSticky` с настоящим `CCMPPlayer`-инстансом (а bridge раньше
 * слал структурный stub без методов — гейм-mod state adapter потом падал на
 * `this.rockModPlayer.setNoCollision is not a function`).
 *
 * **`rm::entityStreamIn/Out`, `rm::playerEnterVehicle/LeaveVehicle`,
 * `rm::playerDeath/Spawn`, `rm::playerWeaponShot`, `rm::click`,
 * `rm::browserDomReady`** — под CCMP не существуют как нативные события;
 * геймод-консьюмер деградирует тихо.
 *
 * **`rm::render`** — поднимает `CCMPRenderTicker`, не этот bridge.
 *
 * ### Что обрабатывается
 *
 * **`rm::playerConnected`/`rm::playerDisconnected`** — синтезируются из
 * нативных `ccmp.on('playerConnected'/'playerDisconnected')`. Stub-объекты
 * `IPlayer` несут `id`/`remoteId`/`name`/`isExists`/`isLocalPlayer:false` —
 * геймод-адаптер читает только это при регистрации в репо, а методы Player'а
 * берёт через `playerFactory.create` (создаёт обёртку поверх stub'а).
 *
 * TODO: переключить эмиссию на настоящие `CCMPPlayer`-инстансы (через
 * `CCMPPlayersManager`-ссылку) — тогда `playerFactory.create` будет
 * хранить полноценный rmPlayer, а не структурный stub без методов. Сейчас
 * это работает потому что для remote-игроков геймод обычно не дёргает
 * методы вне controllers'ов, привязанных к stream-in/out (которых под CCMP
 * нет).
 */
export class CCMPEventsBridge implements IEventsBridge {
  private readonly _events: CCMPEventsManager;

  public constructor(events: CCMPEventsManager) {
    this._events = events;
  }

  public registerRawEvents(): void {
    ccmp.on("playerConnected", (ccmpPlayer: CCMPPlayerLike) => {
      this._events.emitInternal(ClientInternalEventName.PlayerConnected, this._buildPlayerStub(ccmpPlayer));
    });

    ccmp.on("playerDisconnected", (ccmpPlayer: CCMPPlayerLike) => {
      this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, this._buildPlayerStub(ccmpPlayer));
    });
  }

  public registerServerEvents(): void {
    // No-op: ранее тут жил handler для cooperation `rm::clientReady`-ответа.
    // См. блок-комментарий класса — теперь это responsibility
    // `CCMPPlayersManager`.
  }

  private _buildPlayerStub(ccmpPlayer: CCMPPlayerLike): IPlayer {
    const stub = {
      id: ccmpPlayer.id,
      remoteId: ccmpPlayer.id,
      type: "player" as const,
      name: ccmpPlayer.name ?? "",
      isExists: true,
      isLocalPlayer: false,
    };

    return stub as unknown as IPlayer;
  }
}
