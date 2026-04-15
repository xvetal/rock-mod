import { type IMarker } from "../../common";
import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IRGBA, type IVector3D, RGBA, Vector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "@shared/entities";

export interface IRageMarkerOptions extends IRageWorldObjectOptions<MarkerMp> {}

export class RageMarker extends RageWorldObject<MarkerMp> implements IMarker {
  public get markerType(): IMarkerType {
    return this.mpEntity.model;
  }

  public get visible(): boolean {
    return this.mpEntity.visible;
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this.mpEntity.rotation;

    return new Vector3D(x, y, z);
  }

  public constructor(options: IRageMarkerOptions) {
    super(options);
  }

  public setVisible(value: boolean): void {
    this.mpEntity.visible = value;
  }

  public setRotation(value: IVector3D): void {
    this.mpEntity.rotation = new mp.Vector3(value);
  }

  public get scale(): number {
    return this.mpEntity.scale;
  }

  public setScale(value: number): void {
    this.mpEntity.scale = value;
  }

  public get color(): IRGBA {
    const color = this.mpEntity.color;
    return new RGBA(color[0] ?? 0, color[1] ?? 0, color[2] ?? 0, color[3]);
  }

  public setColor(value: IRGBA): void {
    this.mpEntity.color = [value.r, value.g, value.b, value.a ?? 255];
  }
}
