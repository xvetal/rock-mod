import { type IStorageManager } from "@RockMod/client/game";

export class RageStorageManager implements IStorageManager {
  public getData<T>(key: string): T | null {
    const value = mp.storage.data[key];
    return value ?? null;
  }

  public setData<T>(key: string, value: T): void {
    mp.storage.data[key] = value;
  }

  public removeData(key: string): void {
    delete mp.storage.data[key];
  }

  public clearData(prefix?: string): void {
    const keys = Object.keys(mp.storage.data);
    keys.forEach((key) => {
      if (!prefix || key.startsWith(prefix)) {
        delete mp.storage.data[key];
      }
    });
  }
}
