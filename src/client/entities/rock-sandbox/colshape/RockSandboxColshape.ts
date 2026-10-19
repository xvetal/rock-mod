import { type IColshape } from "../../common/colshape/IColshape";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxColshape extends RockSandboxWorldObject implements IColshape {
  public get key(): string | undefined {
    return rockSandboxNotImplemented("client", "RockSandboxColshape.key");
  }
}
