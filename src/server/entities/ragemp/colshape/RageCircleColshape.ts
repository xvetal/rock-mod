import { IRageColshapeOptions, RageColshape } from "./RageColshape";
import { ICircleColshape } from "../../common";

export interface IRageCircleColshapeOptions extends IRageColshapeOptions {}

export class RageCircleColshape extends RageColshape implements ICircleColshape {
  public constructor(options: IRageCircleColshapeOptions) {
    super(options);
  }
}
