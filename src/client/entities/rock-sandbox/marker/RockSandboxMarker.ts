import { type IMarker } from "../../common/marker/IMarker";
import { type IRGBA, type IVector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "../../../../shared/entities";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxMarker extends RockSandboxWorldObject implements IMarker {
  public get markerType(): IMarkerType {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.markerType");
  }

  public get visible(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.visible");
  }

  public get rotation(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.rotation");
  }

  public setVisible(_value: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.setVisible");
  }

  public setRotation(_value: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.setRotation");
  }

  public get scale(): number {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.scale");
  }

  public setScale(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.setScale");
  }

  public get color(): IRGBA {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.color");
  }

  public setColor(_value: IRGBA): void {
    return rockSandboxNotImplemented("client", "RockSandboxMarker.setColor");
  }
}
