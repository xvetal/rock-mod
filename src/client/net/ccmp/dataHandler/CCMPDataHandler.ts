import { type IEntity } from "../../../entities";
import { type IDataHandler } from "../../common/dataHandler/IDataHandler";
import { type CCMPEventsManager } from "../events/CCMPEventsManager";
import { ClientInternalEventName } from "../../common/events/types";

type DataHandlerCallback = (entity: IEntity, value: unknown, oldValue?: unknown) => void;

/**
 * Реализация `IDataHandler` под CCMP поверх `rm::syncedMetaChange`.
 *
 * `CCMPSyncedMetaBridge` переводит нативное событие
 * `ccmp.on('streamSyncedMetaChange')` в internal-bus
 * `rm::syncedMetaChange(entity, key, value, oldValue)`. Этот класс
 * держит per-key реестр колбэков и диспатчит на них пришедшие изменения.
 *
 * Снапшот всех ключей сущности (отправляется CCMP'ом сразу после
 * `StreamIn`) тоже проходит через это событие — поэтому первое появление
 * сущности у клиента триггерит колбэк на каждый уже выставленный сервером
 * ключ (с `oldValue === undefined`).
 */
export class CCMPDataHandler implements IDataHandler {
  private readonly _handlers = new Map<string, DataHandlerCallback[]>();

  public constructor(events: CCMPEventsManager) {
    events.onInternal({
      [ClientInternalEventName.SyncedMetaChange]: (
        entity: IEntity,
        key: string,
        value: unknown,
        oldValue: unknown,
      ): void => {
        const callbacks = this._handlers.get(key);
        if (!callbacks || callbacks.length === 0) {
          return;
        }
        for (const callback of [...callbacks]) {
          try {
            callback(entity, value, oldValue);
          } catch (error) {
            console.error(`[CCMPDataHandler] callback for key "${key}" failed:`, error);
          }
        }
      },
    });
  }

  public addDataHandler(key: string, callback: DataHandlerCallback): void {
    let bucket = this._handlers.get(key);
    if (!bucket) {
      bucket = [];
      this._handlers.set(key, bucket);
    }
    bucket.push(callback);
  }
}
