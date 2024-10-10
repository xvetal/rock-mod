import { ISphereColshape } from "../../common";
import { AltVColshape, IAltVColshapeOptions } from "./AltVColshape";

export interface IAltVSphereColshapeOptions extends IAltVColshapeOptions {}

export class AltVSphereColshape extends AltVColshape implements ISphereColshape {
  public constructor(options: IAltVSphereColshapeOptions) {
    super(options);
  }
}
