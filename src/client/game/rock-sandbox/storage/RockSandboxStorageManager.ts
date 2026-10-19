import { type IStorageManager } from "../../common/storage/IStorageManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxStorageManager implements IStorageManager {
  public getData<T>(_key: string): T | null {
    return rockSandboxNotImplemented("client", "RockSandboxStorageManager.getData");
  }

  public setData<T>(_key: string, _value: T): void {
    return rockSandboxNotImplemented("client", "RockSandboxStorageManager.setData");
  }

  public removeData(_key: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStorageManager.removeData");
  }

  public clearData(_prefix?: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStorageManager.clearData");
  }
}
