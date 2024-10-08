import { IMarker } from "../../common";
import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";

export interface IRageMarkerOptions extends IRageWorldObjectOptions<MarkerMp> {}

export class RageMarker extends RageWorldObject<MarkerMp> implements IMarker {
  public constructor(options: IRageMarkerOptions) {
    super(options);
  }
}
