import { type ILocalPlayerManager } from "../../common/localPlayer/ILocalPlayerManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxLocalPlayerManager implements ILocalPlayerManager {
  public setRunSprintMultiplierFor(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxLocalPlayerManager.setRunSprintMultiplierFor");
  }

  public setSwimMultiplierFor(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxLocalPlayerManager.setSwimMultiplierFor");
  }
}
