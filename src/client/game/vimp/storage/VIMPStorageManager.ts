import { type IStorageManager } from "../../common/storage/IStorageManager";

export class CCMPStorageManager implements IStorageManager {
  public getData<T>(key: string): T | null {
    return ccmp.storage.getItem<T>(key);
  }

  public setData<T>(key: string, value: T): void {
    ccmp.storage.setItem(key, value);
  }

  public removeData(key: string): void {
    ccmp.storage.removeItem(key);
  }

  public clearData(prefix?: string): void {
    ccmp.storage.clear(prefix);
  }
}
