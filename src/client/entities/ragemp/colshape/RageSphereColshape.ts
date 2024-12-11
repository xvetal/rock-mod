import { ISphereColshape } from "../../common";
import { IRageColshapeOptions, RageColshape } from "./RageColshape";

export interface IRageSphereColshapeOptions extends IRageColshapeOptions {}

export class RageSphereColshape extends RageColshape implements ISphereColshape {
  public constructor(options: IRageSphereColshapeOptions) {
    super(options);
  }
}
