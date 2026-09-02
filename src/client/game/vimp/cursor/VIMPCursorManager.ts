/// <reference types="@vimp-mp/types/client" />

import { type ICursorManager } from "@RockMod/client/game";
import { Vector2D } from "@shared/common/utils";

export class VIMPCursorManager implements ICursorManager {
  public show(_freezeControls: boolean, state: boolean): void {
    if (state) {
      vimp.cursor.show();
      return;
    }

    vimp.cursor.hide();
  }

  public getPosition(): Vector2D {
    const position = vimp.cursor.getPosition();
    return new Vector2D(position.x, position.y);
  }
}
