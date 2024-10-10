import { ICircleColshape } from "../../common";
import { AltVColshape, IAltVColshapeOptions } from "./AltVColshape";

export interface IAltVCircleColshapeOptions extends IAltVColshapeOptions {}

export class AltVCircleColshape extends AltVColshape implements ICircleColshape {
  public constructor(options: IAltVCircleColshapeOptions) {
    super(options);
  }
}
