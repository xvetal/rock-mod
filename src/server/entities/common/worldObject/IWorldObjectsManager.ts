import { IBaseObjectCreateOptions, IBaseObjectsManager, IBaseObjectsManagerOptions } from "../baseObject";
import { IWorldObject } from "./IWorldObject";
import { IWorldObjectsIterator } from "./IWorldObjectsIterator";
import { IVector3D } from "../../../common/utils";

export interface IWorldObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export interface IWorldObjectCreateOptions extends IBaseObjectCreateOptions {
  position: IVector3D;
  dimension: number;
}

export interface IWorldObjectsManager<T extends IWorldObject> extends IBaseObjectsManager<T> {
  get iterator(): IWorldObjectsIterator<T>;
}
