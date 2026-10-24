import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxPed, wrapPed } from "./RockSandboxPed";

export class RockSandboxPedsIterator extends RockSandboxWorldObjectsIterator<RockSandboxPed> {
  public override all(): IterableIterator<RockSandboxPed> {
    return getRockSandbox().peds.all().map(wrapPed).values();
  }
}
