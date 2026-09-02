import { type IMarkerCreateOptions, type IMarkersManager } from "../../common/marker/IMarkersManager";
import { VIMPWorldObjectsManager } from "../worldObject/VIMPWorldObjectsManager";
import { VIMPMarker } from "./VIMPMarker";

export interface IVIMPMarkerCreateOptions extends IMarkerCreateOptions {}

export class VIMPMarkersManager extends VIMPWorldObjectsManager<VIMPMarker> implements IMarkersManager {
  public constructor() {
    super({
      baseObjectsType: "marker",
    });
  }

  public create(options: IVIMPMarkerCreateOptions): VIMPMarker {
    const { position, dimension, type, scale, color, rotation } = options;

    const vimpMarker = vimp.markers.create(type, position.x, position.y, position.z, scale, {
      color: { r: color.r, g: color.g, b: color.b, a: color.a ?? 255 },
      rotation: { x: rotation.x, y: rotation.y, z: rotation.z },
      dimension,
    });
    if (!vimpMarker) {
      throw new Error("VIMPMarkersManager.create: vimp.markers.create failed (server full?)");
    }

    const marker = new VIMPMarker({
      vimpMarker,
      onDestroy: (m): void => this.unregisterBaseObject(m),
    });
    this.registerBaseObject(marker);

    return marker;
  }
}
