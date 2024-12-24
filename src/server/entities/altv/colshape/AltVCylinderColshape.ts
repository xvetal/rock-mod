import { type ICylinderColshape } from "../../common";
import { AltVColshape, type IAltVColshapeOptions } from "./AltVColshape";

export interface IAltVCylinderColshapeOptions extends IAltVColshapeOptions {}

export class AltVCylinderColshape extends AltVColshape implements ICylinderColshape {
  public constructor(options: IAltVCylinderColshapeOptions) {
    super(options);
  }
}
