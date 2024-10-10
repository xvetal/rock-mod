import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";

export interface IRageColshapeOptions extends IRageWorldObjectOptions<ColshapeMp> {}

export abstract class RageColshape extends RageWorldObject<ColshapeMp> {
  protected constructor(options: IRageColshapeOptions) {
    super(options);
  }
}
