import { type IMarker } from "../../common";
import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
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
}
