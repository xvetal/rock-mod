import { IMarkerCreateOptions, IMarkersManager } from "../../common";
import { RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";
import { RageMarker } from "./RageMarker";

export interface IRageMarkerCreateOptions extends IMarkerCreateOptions {}

export class RageMarkersManager extends RageWorldObjectsManager<RageMarker> implements IMarkersManager {
  public constructor() {
    super({
      baseObjectsType: "marker",
    });
  }

  public create(options: IRageMarkerCreateOptions): RageMarker {
    const { type, scale, color, position, dimension, rotation } = options;

    const mpEntity = mp.markers.new(type, new mp.Vector3(position), scale, {
      color: [color.r, color.g, color.b, color.a || 255],
      dimension,
      rotation: new mp.Vector3(rotation),
    });
    mpEntity.isExists = (): boolean => mp.objects.exists(mpEntity);

    const marker = new RageMarker({ mpEntity });
    this.registerBaseObject(marker);

    return marker;
  }
}
