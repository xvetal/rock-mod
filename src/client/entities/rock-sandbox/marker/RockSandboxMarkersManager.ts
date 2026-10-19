import { type IMarkersManager, type IMarkerCreateOptions } from "../../common/marker/IMarkersManager";
import { type IMarker } from "../../common/marker/IMarker";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxMarkersManager extends RockSandboxWorldObjectsManager<IMarker> implements IMarkersManager {
  public create(_options: IMarkerCreateOptions): IMarker {
    return rockSandboxNotImplemented("client", "RockSandboxMarkersManager.create");
  }
}
