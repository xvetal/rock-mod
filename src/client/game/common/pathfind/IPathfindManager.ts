import { type IVector3D } from "@shared/common/utils";

export interface IStreetNameHash {
  streetName: number;
  crossingRoad: number;
}

export interface IPathfindManager {
  getStreetNameAtCoord(position: IVector3D): IStreetNameHash;
}
