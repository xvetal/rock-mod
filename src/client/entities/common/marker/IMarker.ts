import { IWorldObject, IWorldObjectOptions } from "../worldObject";
import { IRGBA, IVector3D } from "@shared/common/utils";
import { IMarkerType } from "@shared/entities";

export interface IMarkerOptions extends IWorldObjectOptions {
  type: IMarkerType;
  scale: number;
  color: IRGBA;
  rotation: IVector3D;
}

export interface IMarker extends IWorldObject {
  get markerType(): IMarkerType;
  get visible(): boolean;
  get rotation(): IVector3D;
  setVisible(value: boolean): void;
  setRotation(value: IVector3D): void;
}
