import { IMarkerCreateOptions, IMarkersManager } from "../../common";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";
import { AltVMarker } from "./AltVMarker";
import alt = AltVServer;
import MarkerType = AltVShared.MarkerType;
import Vector3 = AltVShared.Vector3;
import RGBA = AltVShared.RGBA;

export interface IAltVMarkerCreateOptions extends IMarkerCreateOptions {}

export class AltVMarkersManager extends AltVWorldObjectsManager<AltVMarker> implements IMarkersManager {
  public constructor() {
    super({
      baseObjectsType: "marker",
    });
  }

  public create(options: IAltVMarkerCreateOptions): AltVMarker {
    const { type, scale, color, position, dimension, rotation } = options;

    const mpEntity = new alt.Marker(type as unknown as MarkerType, new Vector3(position), color as RGBA);
    mpEntity.scale = new Vector3(scale, scale, scale);
    mpEntity.dimension = dimension;
    mpEntity.rot = new Vector3(rotation);

    const marker = new AltVMarker({ mpEntity });
    this.registerBaseObject(marker);

    return marker;
  }
}
