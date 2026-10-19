import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxBaseObject } from "../baseObject/RockSandboxBaseObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxWorldObject extends RockSandboxBaseObject implements IWorldObject {
  public get position(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObject.position");
  }

  public get dimension(): number {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObject.dimension");
  }

  public setPosition(_value: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObject.setPosition");
  }

  public setDimension(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObject.setDimension");
  }

  public setCoords(
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xAxis: boolean,
    _yAxis: boolean,
    _zAxis: boolean,
    _clearArea: boolean,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxWorldObject.setCoords");
  }
}
