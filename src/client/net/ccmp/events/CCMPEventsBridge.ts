/// <reference types="@classic-mp/types/client" />
import { ClientInternalEventName } from "../../common/events/types";
import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { type IPlayer } from "../../../entities/common";
import { type CCMPEventsManager } from "./CCMPEventsManager";

/**
 * Имя cooperation-события для разрешения `rm::playerReady`.
 *
 * У CCMP-клиента нет аналога `playerReady`/`localPlayer.id`. Решение: на
 * `connectionStateChanged.connected = true` шлём это событие серверу, сервер
 * отвечает тому же игроку этим же именем с его `remoteId`. По получении
 * ответа клиент эмитит `rm::playerReady`. Серверная сторона реализована в
 * `src/server/net/ccmp/CCMPNetManager.ts`.
 */
const CLIENT_READY_EVENT = "rm::clientReady";

interface CCMPPlayerLike {
  readonly id: number;
  readonly name?: string;
}

interface ServerReadyPayload {
  remoteId: number;
}

/**
 * Связывает нативные CCMP события и кастомные кооперационные сообщения с
 * внутренней шиной `rm::*`, на которую подписан геймод.
 *
 * Ограничения первого milestone:
 *  - Нет CCMPEntityPoolRouter — на месте `IPlayer` отдаём минимальный
 *    структурный stub с `id`/`remoteId`/`type`. Геймод-консьюмер
 *    (`rock-mod-multiplayer-events-adapter`) читает только эти поля.
 *  - `rm::entityStreamIn/Out`, `rm::playerEnterVehicle/LeaveVehicle`,
 *    `rm::playerDeath/Spawn`, `rm::playerWeaponShot`, `rm::click`,
 *    `rm::browserDomReady` под CCMP не существуют как нативные события —
 *    оставляем неэмитимыми (геймод-консьюмер деградирует тихо).
 *  - `rm::render` поднимает `CCMPRenderTicker`, не этот bridge.
 */
export class CCMPEventsBridge implements IEventsBridge {
  private _clientReadySent = false;

  private readonly _events: CCMPEventsManager;

  public constructor(events: CCMPEventsManager) {
    this._events = events;
  }

  public registerRawEvents(): void {
    // 1. Триггер кооперации — как только мы подключились, просим у сервера
    //    наш remoteId.
    ccmp.on("connectionStateChanged", (state: { connected: boolean }) => {
      if (!state?.connected || this._clientReadySent) {
        return;
      }

      this._clientReadySent = true;
      // Используем escape-hatch `register`/raw emit — событие не в
      // `IClientToServerEvents`. На сервере ловим через `onClient`-аналог.
      ccmp.emitServer(CLIENT_READY_EVENT, []);
    });

    // 2. Remote-пиры приходят/уходят.
    ccmp.on("playerConnected", (ccmpPlayer: CCMPPlayerLike) => {
      this._events.emitInternal(ClientInternalEventName.PlayerConnected, this._buildPlayerStub(ccmpPlayer));
    });

    ccmp.on("playerDisconnected", (ccmpPlayer: CCMPPlayerLike) => {
      this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, this._buildPlayerStub(ccmpPlayer));
    });
  }

  public registerServerEvents(): void {
    // Ответ сервера на `rm::clientReady` — синтезируем `rm::playerReady`.
    this._events.register(CLIENT_READY_EVENT, (payload: unknown) => {
      const remoteId = (payload as ServerReadyPayload | undefined)?.remoteId;
      if (typeof remoteId !== "number") {
        return;
      }

      this._events.emitInternal(ClientInternalEventName.PlayerReady, this._buildLocalPlayerStub(remoteId));
    });

    // EntityCreated/Destroyed из `ServerToClientEventName` пропускаем —
    // CCMP entity pool ещё не реализован.
  }

  private _buildPlayerStub(ccmpPlayer: CCMPPlayerLike): IPlayer {
    // Структурный stub. Геймод читает только `.remoteId` / `.type` / `.id`.
    // Полный `IPlayer` появится при реализации `CCMPPlayersManager`.
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

  private _buildLocalPlayerStub(remoteId: number): IPlayer {
    const stub = {
      id: remoteId,
      remoteId,
      type: "player" as const,
      name: "",
      isExists: true,
      isLocalPlayer: true,
    };

    return stub as unknown as IPlayer;
  }
}
