import { type INativeCallerManager } from "../../common/native/INativeCallerManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxNativeCallerManager implements INativeCallerManager {
  public callNative(_hash: string, ..._args: unknown[]): unknown {
    return rockSandboxNotImplemented("client", "RockSandboxNativeCallerManager.callNative");
  }
}
