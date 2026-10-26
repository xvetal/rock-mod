import { type ICursorManager } from "../../common/cursor/ICursorManager";
import { type IVector2D } from "../../../../shared/common/utils";
import { Vector2D } from "../../../../shared/common/utils";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxCursorManager implements ICursorManager {
  public show(freezeControls: boolean, state: boolean): void {
    getRockSandbox().cursor.setVisible(state, freezeControls);
    // SDK-local notification. The application owns which browser takes input.
    getRockSandbox().emit("rm::cursorVisibilityChanged", state);
  }

  public getPosition(): IVector2D {
    const { x, y } = getRockSandbox().cursor.getPosition();
    return new Vector2D(x, y);
  }
}
