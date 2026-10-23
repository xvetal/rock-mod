import { type IKeysManager } from "../../common/keys/IKeysManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxKeysManager implements IKeysManager {
  public isDown(key: number): boolean {
    return getRockSandbox().keys.isDown(key);
  }

  public isUp(key: number): boolean {
    return getRockSandbox().keys.isUp(key);
  }

  public bind(key: number, keyHold: boolean, handler: () => void): void {
    getRockSandbox().keys.bind(key, keyHold, handler);
  }

  public unbind(key: number, keyHold: boolean, handler?: () => void): void {
    getRockSandbox().keys.unbind(key, keyHold, handler);
  }
}
