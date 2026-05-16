import { type IEntity } from "../../../entities";
import { type IDataHandler } from "../../common/dataHandler/IDataHandler";

/**
 * No-op реализация `IDataHandler` под CCMP.
 *
 * RageMP даёт `mp.events.addDataHandler(key, cb)` — слежение за изменением
 * shared metadata на сущностях. У CCMP такого примитива на клиенте нет.
 *
 * Кидать ошибку здесь нельзя: геймод-консьюмер `RockModMultiplayerEventsAdapter`
 * вызывает `addDataHandler` в конструкторе для PLAYER_NETWORK_DATA_KEYS и
 * VEHICLE_NETWORK_DATA_KEYS — исключение поднимет весь DI-bootstrap. Поэтому
 * молча подписываем колбэк в реестр (никогда не дёрнем) и пишем разовый
 * warn на ключ, чтобы было видно в логах что фича недоступна.
 */
export class CCMPDataHandler implements IDataHandler {
  private readonly _warnedKeys = new Set<string>();

  public addDataHandler(key: string, callback: (entity: IEntity, value: unknown, oldValue?: unknown) => void): void {
    // CCMP не предоставляет entity metadata API — колбэк никогда не дёрнем.
    // Параметр оставляем в сигнатуре для контрактной совместимости с
    // `IDataHandler`; явный `void` чтобы линтер видел его использованным.
    void callback;

    if (this._warnedKeys.has(key)) {
      return;
    }

    this._warnedKeys.add(key);
    console.warn(
      `[CCMPDataHandler] addDataHandler("${key}") вызван, но CCMP не предоставляет ` +
        `entity metadata API. Колбэк никогда не сработает.`,
    );
  }
}
