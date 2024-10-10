import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Marker = AltVServer.Marker;
import { IMarker } from "../../common";
import Vector3 = AltVShared.Vector3;

export interface IAltVMarkerOptions extends IAltVWorldObjectOptions<Marker> {}

export class AltVMarker extends AltVWorldObject<Marker> implements IMarker {
  public get visible(): boolean {
    return this.mpEntity.visible;
  }

  public get scale(): number {
    return this.mpEntity.scale.z;
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
}
