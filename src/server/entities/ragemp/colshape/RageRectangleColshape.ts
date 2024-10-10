import { IRectangleColshape } from "../../common";
import { IRageColshapeOptions, RageColshape } from "./RageColshape";

export interface IRageRectangleColshapeOptions extends IRageColshapeOptions {}

export class RageRectangleColshape extends RageColshape implements IRectangleColshape {
  public constructor(options: IRageRectangleColshapeOptions) {
    super(options);
  }
}
