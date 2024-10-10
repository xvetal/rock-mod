import { ICuboidColshape } from "../../common";
import { AltVColshape, IAltVColshapeOptions } from "./AltVColshape";

export interface IAltVCuboidColshapeOptions extends IAltVColshapeOptions {}

export class AltVCuboidColshape extends AltVColshape implements ICuboidColshape {
  public constructor(options: IAltVCuboidColshapeOptions) {
    super(options);
  }
}
