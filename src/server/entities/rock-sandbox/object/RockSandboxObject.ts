import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxObject extends RockSandboxEntity implements IObject {
  public get alpha(): number {
    return rockSandboxNotImplemented("server", "RockSandboxObject.alpha");
  }

  public setAlpha(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxObject.setAlpha");
  }
}
