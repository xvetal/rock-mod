import { type IRectangleColshape } from "../../common";
import { AltVColshape, type IAltVColshapeOptions } from "./AltVColshape";

export interface IAltVRectangleColshapeOptions extends IAltVColshapeOptions {}

export class AltVRectangleColshape extends AltVColshape implements IRectangleColshape {
  public constructor(options: IAltVRectangleColshapeOptions) {
    super(options);
  }
}
