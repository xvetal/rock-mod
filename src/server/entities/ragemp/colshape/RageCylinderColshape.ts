import { type ICylinderColshape } from "../../common";
import { type IRageColshapeOptions, RageColshape } from "./RageColshape";

export interface IRageCylinderColshapeOptions extends IRageColshapeOptions {}

export class RageCylinderColshape extends RageColshape implements ICylinderColshape {
  public constructor(options: IRageCylinderColshapeOptions) {
    super(options);
  }
}
