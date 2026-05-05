import { type IMarkerCreateOptions, type IMarkersManager } from "../../common/marker/IMarkersManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { type CCMPMarker } from "./CCMPMarker";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPMarkerCreateOptions extends IMarkerCreateOptions {}

export class CCMPMarkersManager extends CCMPWorldObjectsManager<CCMPMarker> implements IMarkersManager {
  public constructor() {
    super({
      baseObjectsType: "marker",
    });
  }

  public create(_options: ICCMPMarkerCreateOptions): CCMPMarker {
    return notImplemented("CCMPMarkersManager.create");
  }
}
