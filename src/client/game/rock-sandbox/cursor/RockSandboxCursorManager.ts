import { type ICursorManager } from "../../common/cursor/ICursorManager";
import { type IVector2D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxCursorManager implements ICursorManager {
  public show(_freezeControls: boolean, _state: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxCursorManager.show");
  }

  public getPosition(): IVector2D {
    return rockSandboxNotImplemented("client", "RockSandboxCursorManager.getPosition");
  }
}
