import { type IMarker } from "../../common/marker/IMarker";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapMarker } from "./RockSandboxMarker";
export class RockSandboxMarkersIterator extends RockSandboxWorldObjectsIterator<IMarker> {
  public override all(): IterableIterator<IMarker> {
    return getRockSandbox().markers.all().map(wrapMarker).values();
  }
}
