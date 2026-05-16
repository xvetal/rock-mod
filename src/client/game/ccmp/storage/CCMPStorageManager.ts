import { type IStorageManager } from "../../common/storage/IStorageManager";

/**
 * In-memory реализация `IStorageManager` под CCMP.
 *
 * RageMP даёт `mp.storage.data` — персистентное JSON-K/V на диске между
 * сессиями. У CCMP нативного аналога client-side storage пока нет. Этот
 * MVP — обычный `Map` в памяти процесса:
 *  - Данные доступны в рамках одной сессии.
 *  - Не переживают переподключение/перезапуск игры.
 *
 * Этого достаточно для `CacheController` геймода: пустой кэш заставит
 * перезапросить данные с сервера, чуть менее эффективно но функционально.
 *
 * Долгосрочно: добавить persistent storage в CCMP-клиент (Rust) — файл в
 * `%APPDATA%/ccmp/storage/<server>.json` через `Deno.core.ops`, тогда
 * заменить этот класс на адаптер к ops.
 */
export class CCMPStorageManager implements IStorageManager {
  private readonly _data = new Map<string, unknown>();

  public constructor() {
    console.warn("[rock-mod] CCMPStorageManager uses in-memory storage; data will not persist between sessions");
  }

  public getData<T>(key: string): T | null {
    if (!this._data.has(key)) {
      return null;
    }
    return (this._data.get(key) as T) ?? null;
  }

  public setData<T>(key: string, value: T): void {
    this._data.set(key, value);
  }

  public removeData(key: string): void {
    this._data.delete(key);
  }

  public clearData(prefix?: string): void {
    if (!prefix) {
      this._data.clear();
      return;
    }

    for (const key of [...this._data.keys()]) {
      if (key.startsWith(prefix)) {
        this._data.delete(key);
      }
    }
  }
}
