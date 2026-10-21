import { type IObject } from "../../common/object/IObject";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapObject } from "./RockSandboxObject";
export class RockSandboxObjectsIterator extends RockSandboxWorldObjectsIterator<IObject> {
  public override all(): IterableIterator<IObject> {
    return getRockSandbox().objects.all().map(wrapObject).values();
  }
}
