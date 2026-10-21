import { type IBlip } from "../../common/blip/IBlip";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapBlip } from "./RockSandboxBlip";
export class RockSandboxBlipsIterator extends RockSandboxWorldObjectsIterator<IBlip> {
  public override all(): IterableIterator<IBlip> {
    return getRockSandbox().blips.all().map(wrapBlip).values();
  }
}
