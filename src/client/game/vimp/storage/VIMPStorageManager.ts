import { type IStorageManager } from "../../common/storage/IStorageManager";

export class VIMPStorageManager implements IStorageManager {
  public getData<T>(key: string): T | null {
    return vimp.storage.getItem<T>(key);
  }

  public setData<T>(key: string, value: T): void {
    vimp.storage.setItem(key, value);
  }

  public removeData(key: string): void {
    vimp.storage.removeItem(key);
  }

  public clearData(prefix?: string): void {
    vimp.storage.clear(prefix);
  }
}
