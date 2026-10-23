import { type INametagsManager } from "../../common/nametags/INametagsManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxNametagsManager implements INametagsManager {
  public setEnabled(enabled: boolean): void {
    getRockSandbox().nametags.setEnabled(enabled);
  }
}
