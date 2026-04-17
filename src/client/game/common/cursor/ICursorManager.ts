import { type IVector2D } from "@shared/common/utils";

export interface ICursorManager {
  show(freezeControls: boolean, state: boolean): void;
  getPosition(): IVector2D;
}
