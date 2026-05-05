import { type IMarker } from "../../common/marker/IMarker";
import { CCMPWorldObject } from "../worldObject/CCMPWorldObject";
import { type IRGBA, type IVector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "../../../../shared";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPMarker extends CCMPWorldObject implements IMarker {
  public get markerType(): IMarkerType {
    return notImplemented("CCMPMarker.markerType");
  }

  public get visible(): boolean {
    return notImplemented("CCMPMarker.visible");
  }

  public get scale(): number {
    return notImplemented("CCMPMarker.scale");
  }

  public get color(): IRGBA {
    return notImplemented("CCMPMarker.color");
  }

  public get rotation(): IVector3D {
    return notImplemented("CCMPMarker.rotation");
  }

  public setVisible(_value: boolean): void {
    notImplemented("CCMPMarker.setVisible");
  }

  public setScale(_value: number): void {
    notImplemented("CCMPMarker.setScale");
  }

  public setColor(_value: IRGBA): void {
    notImplemented("CCMPMarker.setColor");
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("CCMPMarker.setRotation");
  }
}
