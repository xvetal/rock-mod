import { IMarker, IMarkerType } from "../../common";
import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { IRGBA, IVector3D, RGBA, Vector3D } from "../../../common/utils";

export interface IRageMarkerOptions extends IRageWorldObjectOptions<MarkerMp> {}

export class RageMarker extends RageWorldObject<MarkerMp> implements IMarker {
  public get markerType(): IMarkerType {
    return this.mpEntity.model;
  }

  public get visible(): boolean {
    return this.mpEntity.visible;
  }

  public get scale(): number {
    return this.mpEntity.scale;
  }

  public get color(): IRGBA {
    const [r, g, b, a] = this.mpEntity.getColor();

    return new RGBA(r as number, g as number, b as number, a ?? 255);
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

  public setScale(value: number): void {
    this.mpEntity.scale = value;
  }

  public setColor(value: IRGBA): void {
    const { r, g, b, a } = value;

    this.mpEntity.setColor(r, g, b, a ?? 255);
  }

  public setRotation(value: IVector3D): void {
    this.mpEntity.rotation = new mp.Vector3(value);
  }
}
