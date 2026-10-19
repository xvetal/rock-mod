import { type ICamera } from "../../common/camera/ICamera";
import { type IVector3D, type Vector3D } from "../../../../shared/common/utils";
import { RockSandboxBaseObject } from "../baseObject/RockSandboxBaseObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxCamera extends RockSandboxBaseObject implements ICamera {
  public get isActive(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.isActive");
  }

  public setIsActive(_value: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.setIsActive");
  }

  public get direction(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.direction");
  }

  public get fov(): number {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.fov");
  }

  public setFov(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.setFov");
  }

  public pointAtCoord(_value: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.pointAtCoord");
  }

  public setPosition(_value: Vector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.setPosition");
  }

  public get position(): Vector3D {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.position");
  }

  public get rotation(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.rotation");
  }

  public setRotation(_value: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxCamera.setRotation");
  }
}
