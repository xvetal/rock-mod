import { type INametagsManager } from "../../common/nametags/INametagsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxNametagsManager implements INametagsManager {
  public setEnabled(_enabled: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxNametagsManager.setEnabled");
  }
}
