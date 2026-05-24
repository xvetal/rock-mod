/// <reference types="@classic-mp/types/client" />

import { type ICursorManager } from "@RockMod/client/game";
import { Vector2D } from "@shared/common/utils";

export class CCMPCursorManager implements ICursorManager {
  public show(_freezeControls: boolean, state: boolean): void {
    if (state) {
      ccmp.cursor.show();
      return;
    }

    ccmp.cursor.hide();
  }

  public getPosition(): Vector2D {
    const position = ccmp.cursor.getPosition();
    return new Vector2D(position.x, position.y);
  }
}
