import { IMarker } from "./IMarker";
import { IWorldObjectCreateOptions, IWorldObjectsManager } from "../worldObject";
import { IRGBA, IVector3D } from "../../../../shared/common/utils";
import { IMarkerType } from "../../../../shared";

export interface IMarkerCreateOptions extends IWorldObjectCreateOptions {
  type: IMarkerType;
  scale: number;
  color: IRGBA;
  rotation: IVector3D;
}

export interface IMarkersManager extends IWorldObjectsManager<IMarker> {
  create(options: IMarkerCreateOptions): IMarker;
}
