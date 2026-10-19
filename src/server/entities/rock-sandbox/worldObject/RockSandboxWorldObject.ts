import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxBaseObject } from "../baseObject/RockSandboxBaseObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxWorldObject extends RockSandboxBaseObject implements IWorldObject {
  public get position(): IVector3D {
    return rockSandboxNotImplemented("server", "RockSandboxWorldObject.position");
  }

  public get dimension(): number {
    return rockSandboxNotImplemented("server", "RockSandboxWorldObject.dimension");
  }

  public setPosition(_value: IVector3D): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldObject.setPosition");
  }

  public setDimension(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxWorldObject.setDimension");
  }
}
