import { type IMarker } from "../../common/marker/IMarker";
import { type IRGBA, type IVector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "../../../../shared";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxMarker extends RockSandboxWorldObject implements IMarker {
  public get markerType(): IMarkerType {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.markerType");
  }

  public get visible(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.visible");
  }

  public get scale(): number {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.scale");
  }

  public get color(): IRGBA {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.color");
  }

  public get rotation(): IVector3D {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.rotation");
  }

  public setVisible(_value: boolean): void {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.setVisible");
  }

  public setScale(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.setScale");
  }

  public setColor(_value: IRGBA): void {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.setColor");
  }

  public setRotation(_value: IVector3D): void {
    return rockSandboxNotImplemented("server", "RockSandboxMarker.setRotation");
  }
}
