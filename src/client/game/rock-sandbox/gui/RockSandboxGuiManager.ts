import { type IGuiManager } from "../../common/gui/IGuiManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGuiManager implements IGuiManager {
  public takeScreenshot(_name: string, _type: number, _quality: number, _compressionQuality: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxGuiManager.takeScreenshot");
  }
}
