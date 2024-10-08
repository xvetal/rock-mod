import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Marker = AltVServer.Marker;
import { IMarker } from "../../common";

export interface IAltVMarkerOptions extends IAltVWorldObjectOptions<Marker> {}

export class AltVMarker extends AltVWorldObject<Marker> implements IMarker {
  public constructor(options: IAltVMarkerOptions) {
    super(options);
  }
}
