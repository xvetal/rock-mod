import { type IMarker } from "./IMarker";
import { type IWorldObjectCreateOptions, type IWorldObjectsManager } from "../worldObject";
import { type IRGBA, type IVector3D } from "../../../../shared/common/utils";
import { type IMarkerType } from "../../../../shared";

export interface IMarkerCreateOptions extends IWorldObjectCreateOptions {
  type: IMarkerType;
  scale: number;
  color: IRGBA;
  rotation: IVector3D;
}

export interface IMarkersManager extends IWorldObjectsManager<IMarker> {
  create(options: IMarkerCreateOptions): IMarker;
}
