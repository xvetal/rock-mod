import { AltVWorldObject, type IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Marker = AltVServer.Marker;
import { type IMarker } from "../../common";
import Vector3 = AltVShared.Vector3;
import { type IRGBA, type IVector3D, RGBA, Vector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "../../../../shared";

export interface IAltVMarkerOptions extends IAltVWorldObjectOptions<Marker> {}

export class AltVMarker extends AltVWorldObject<Marker> implements IMarker {
  public get markerType(): IMarkerType {
    return this.mpEntity.markerType as unknown as IMarkerType;
  }

  public get visible(): boolean {
    return this.mpEntity.visible;
  }

  public get scale(): number {
    return this.mpEntity.scale.z;
  }

  public get color(): IRGBA {
    const { r, g, b, a } = this.mpEntity.color;

    return new RGBA(r, g, b, a);
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this.mpEntity.rot;

    return new Vector3D(x, y, z);
  }

  public constructor(options: IAltVMarkerOptions) {
    super(options);
  }

  public setVisible(value: boolean): void {
    this.mpEntity.visible = value;
  }

  public setScale(value: number): void {
    this.mpEntity.scale = new Vector3(0, 0, value);
  }

  public setColor(value: IRGBA): void {
    const { r, g, b, a } = value;

    this.mpEntity.color = new AltVShared.RGBA(r, g, b, a);
  }

  public setRotation(value: IVector3D): void {
    this.mpEntity.rot = new Vector3(value);
  }
}
