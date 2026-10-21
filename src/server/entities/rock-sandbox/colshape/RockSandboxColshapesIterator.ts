import { type IColshape } from "../../common/colshape/IColshape";
import { RockSandboxWorldObjectsIterator } from "../worldObject/RockSandboxWorldObjectsIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapColshape } from "./RockSandboxCylinderColshape";

export class RockSandboxColshapesIterator extends RockSandboxWorldObjectsIterator<IColshape> {
  public override all(): IterableIterator<IColshape> {
    return getRockSandbox().colshapes.all().map(wrapColshape).values();
  }
}
