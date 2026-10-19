import { type IUtilsManager } from "../common/IUtilsManager";
import { rockSandboxNotImplemented } from "../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxUtilsManager implements IUtilsManager {
  public hash(_value: string): number {
    return rockSandboxNotImplemented("server", "RockSandboxUtilsManager.hash");
  }
}
