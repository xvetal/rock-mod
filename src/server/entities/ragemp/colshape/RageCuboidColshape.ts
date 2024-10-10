import { IRageColshapeOptions, RageColshape } from "./RageColshape";
import { ICuboidColshape } from "../../common";

export interface IRageCuboidColshapeOptions extends IRageColshapeOptions {}

export class RageCuboidColshape extends RageColshape implements ICuboidColshape {
  public constructor(options: IRageCuboidColshapeOptions) {
    super(options);
  }
}
