import { type IVector3D } from "@shared/common/utils";

export interface IZoneManager {
  getNameOfZone(position: IVector3D): string;
}
