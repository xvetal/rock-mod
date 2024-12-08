import { IWorldObject, IWorldObjectOptions } from "../worldObject";
import { IMarkerType } from "./IMarkersManager";
import { IRGBA, IVector3D } from "../../../common/utils";

export interface IMarkerOptions extends IWorldObjectOptions {
  type: IMarkerType;
  scale: number;
  color: IRGBA;
  rotation: IVector3D;
}

export interface IMarker extends IWorldObject {
  get markerType(): IMarkerType;
  get visible(): boolean;
  get scale(): number;
  get color(): IRGBA;
  get rotation(): IVector3D;
  setVisible(value: boolean): void;
  setScale(value: number): void;
  setColor(value: IRGBA): void;
  setRotation(value: IVector3D): void;
}
