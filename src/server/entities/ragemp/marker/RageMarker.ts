import { IMarker } from "../../common";
import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";

export interface IRageMarkerOptions extends IRageWorldObjectOptions<MarkerMp> {}

export class RageMarker extends RageWorldObject<MarkerMp> implements IMarker {
  public get visible(): boolean {
    return this.mpEntity.visible;
  }

  public get scale(): number {
    return this.mpEntity.scale;
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
}
