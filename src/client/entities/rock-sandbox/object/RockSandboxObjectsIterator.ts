import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxObject, wrapObject } from "./RockSandboxObject";

export class RockSandboxObjectsIterator extends RockSandboxWorldObjectsIterator<RockSandboxObject> {
  public override all(): IterableIterator<RockSandboxObject> {
    return getRockSandbox().objects.all().map(wrapObject).values();
  }
}
