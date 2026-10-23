import { type IStorageManager } from "../../common/storage/IStorageManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxStorageManager implements IStorageManager {
  public getData<T>(key: string): T | null {
    return getRockSandbox().storage.getItem<T>(key);
  }

  public setData<T>(key: string, value: T): void {
    getRockSandbox().storage.setItem(key, value);
  }

  public removeData(key: string): void {
    getRockSandbox().storage.removeItem(key);
  }

  public clearData(prefix?: string): void {
    getRockSandbox().storage.clear(prefix);
  }
}
