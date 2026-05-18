/// <reference types="@classic-mp/types/client" />
import { type CCMPPlayersManager } from "@RockMod/client/entities/ccmp/player/CCMPPlayersManager";
import { ClientInternalEventName } from "../../common/events/types";
import { type CCMPEventsManager } from "./CCMPEventsManager";

/**
 * Переводит нативное CCMP-событие `streamSyncedMetaChange` в internal-bus
 * `rm::syncedMetaChange`.
 *
 * Вынесено в отдельный класс от `CCMPEventsBridge` из-за порядка
 * инстанцирования: bridge'у нужна ссылка на `CCMPPlayersManager` чтобы
 * резолвить `payload.entityId → CCMPPlayer`, а players manager создаётся
 * в `CCMPManagersFactory` **после** `CCMPNetManager` (внутри которого
 * живёт `CCMPEventsBridge`). Поэтому этот bridge создаётся вторым
 * шагом из `createPlayersManager`, когда обе зависимости уже доступны.
 *
 * Сейчас обслуживается только `entityType === Player` (=0) — на клиенте
 * rock-mod-CCMP других сущностей пока нет. Остальные типы тихо
 * игнорируем (snapshot прилетает на каждом stream-in, для несуществующих
 * на клиенте сущностей это нормально).
 */
export class CCMPSyncedMetaBridge {
  private readonly _events: CCMPEventsManager;

  private readonly _playersManager: CCMPPlayersManager;

  public constructor(events: CCMPEventsManager, playersManager: CCMPPlayersManager) {
    this._events = events;
    this._playersManager = playersManager;
  }

  public register(): void {
    ccmp.on("streamSyncedMetaChange", (payload) => {
      if (payload.entityType !== ccmp.entities.ENTITY_TYPE.Player) {
        return;
      }

      const player = this._playersManager.findByRemoteId(payload.entityId);
      if (!player) {
        return;
      }

      this._events.emitInternal(
        ClientInternalEventName.SyncedMetaChange,
        player,
        payload.key,
        payload.newValue,
        payload.oldValue,
      );
    });
  }
}
