import { type ICursorManager } from "@RockMod/client/game";
import { Vector2D } from "@shared/common/utils";

export class RageCursorManager implements ICursorManager {
  public show(freezeControls: boolean, state: boolean): void {
    mp.gui.cursor.show(freezeControls, state);
  }

  public getPosition(): Vector2D {
    const [x, y] = mp.gui.cursor.position;
    return new Vector2D(x, y);
  }
}
