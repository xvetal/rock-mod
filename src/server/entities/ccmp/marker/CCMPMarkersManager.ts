import { type IMarkerCreateOptions, type IMarkersManager } from "../../common/marker/IMarkersManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { CCMPMarker } from "./CCMPMarker";

export interface ICCMPMarkerCreateOptions extends IMarkerCreateOptions {}

export class CCMPMarkersManager extends CCMPWorldObjectsManager<CCMPMarker> implements IMarkersManager {
  public constructor() {
    super({
      baseObjectsType: "marker",
    });
  }

  public create(options: ICCMPMarkerCreateOptions): CCMPMarker {
    const { position, dimension, type, scale, color, rotation } = options;

    const ccmpMarker = ccmp.markers.create(type, position.x, position.y, position.z, scale, {
      color: { r: color.r, g: color.g, b: color.b, a: color.a ?? 255 },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      dimension,
    });
    if (!ccmpMarker) {
      throw new Error("CCMPMarkersManager.create: ccmp.markers.create failed (server full?)");
    }

    const marker = new CCMPMarker({
      ccmpMarker,
      onDestroy: (m): void => this.unregisterBaseObject(m),
    });
    this.registerBaseObject(marker);

    return marker;
  }
}
