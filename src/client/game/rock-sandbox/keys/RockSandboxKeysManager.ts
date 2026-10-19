import { type IKeysManager } from "../../common/keys/IKeysManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxKeysManager implements IKeysManager {
  public isDown(_key: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxKeysManager.isDown");
  }

  public isUp(_key: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxKeysManager.isUp");
  }

  public bind(_key: number, _keyHold: boolean, _handler: () => void): void {
    return rockSandboxNotImplemented("client", "RockSandboxKeysManager.bind");
  }

  public unbind(_key: number, _keyHold: boolean, _handler?: () => void): void {
    return rockSandboxNotImplemented("client", "RockSandboxKeysManager.unbind");
  }
}
