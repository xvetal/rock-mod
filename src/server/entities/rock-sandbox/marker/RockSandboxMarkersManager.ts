import { type IMarkersManager, type IMarkerCreateOptions } from "../../common/marker/IMarkersManager";
import { type IMarker } from "../../common/marker/IMarker";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapMarker } from "./RockSandboxMarker";
import { RockSandboxMarkersIterator } from "./RockSandboxMarkersIterator";
import { nativeMarkerType } from "./mapping";
export class RockSandboxMarkersManager extends RockSandboxWorldObjectsManager<IMarker> implements IMarkersManager {
  private readonly _markersIterator = new RockSandboxMarkersIterator();

  public override get iterator(): RockSandboxMarkersIterator {
    return this._markersIterator;
  }

  public override findByID(id: number): IMarker | null {
    const marker = getRockSandbox().markers.getById(id);
    return marker === null ? null : wrapMarker(marker);
  }

  public override getByID(id: number): IMarker {
    const marker = this.findByID(id);
    if (marker === null)
      throw new Error(`[RockSandbox:server] RockSandboxMarkersManager.getByID: marker ${id} not found`);
    return marker;
  }

  public create(options: IMarkerCreateOptions): IMarker {
    return wrapMarker(
      getRockSandbox().markers.create({
        type: nativeMarkerType(options.type),
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        dimension: options.dimension,
        rotation: { x: options.rotation.x, y: options.rotation.z, z: -options.rotation.y },
        scale: options.scale,
        color: { r: options.color.r, g: options.color.g, b: options.color.b, a: options.color.a },
      }),
    );
  }
}
