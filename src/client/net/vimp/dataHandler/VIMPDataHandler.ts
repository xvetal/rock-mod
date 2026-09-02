import { type IBaseObject } from "../../../entities";
import { type IDataHandler } from "../../common/dataHandler/IDataHandler";
import { type VIMPEventsManager } from "../events/VIMPEventsManager";
import { ClientInternalEventName } from "../../common/events/types";

type DataHandlerCallback = (object: IBaseObject, value: unknown, oldValue?: unknown) => void;

/**
 * Реализация `IDataHandler` под VIMP поверх `rm::syncedMetaChange`.
 *
 * `VIMPSyncedMetaBridge` переводит нативное событие
 * `vimp.on('streamSyncedMetaChange')` в internal-bus
 * `rm::syncedMetaChange(entity, key, value, oldValue)`. Этот класс
 * держит per-key реестр колбэков и диспатчит на них пришедшие изменения.
 *
 * Снапшот всех ключей сущности (отправляется VIMP'ом сразу после
 * `StreamIn`) тоже проходит через это событие — поэтому первое появление
 * сущности у клиента триггерит колбэк на каждый уже выставленный сервером
 * ключ (с `oldValue === undefined`).
 */
export class VIMPDataHandler implements IDataHandler {
  private readonly _handlers = new Map<string, DataHandlerCallback[]>();

  public constructor(events: VIMPEventsManager) {
    events.onInternal({
      [ClientInternalEventName.SyncedMetaChange]: (
        object: IBaseObject,
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
            callback(object, value, oldValue);
          } catch (error) {
            console.error(`[VIMPDataHandler] callback for key "${key}" failed:`, error);
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
