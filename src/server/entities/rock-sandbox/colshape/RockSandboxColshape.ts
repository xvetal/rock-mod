import { type IColshape } from "../../common/colshape/IColshape";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxColshape extends RockSandboxWorldObject implements IColshape {
  public get key(): string | undefined {
    return rockSandboxNotImplemented("server", "RockSandboxColshape.key");
  }

  public getNetData(_name: string): unknown {
    return rockSandboxNotImplemented("server", "RockSandboxColshape.getNetData");
  }

  public setNetData(_name: string, _value: unknown): void {
    return rockSandboxNotImplemented("server", "RockSandboxColshape.setNetData");
  }
}
