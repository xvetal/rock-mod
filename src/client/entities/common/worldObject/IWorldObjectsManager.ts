import {
  type IBaseObjectCreateOptions,
  type IBaseObjectsManager,
  type IBaseObjectsManagerOptions,
} from "../baseObject";
import { type IWorldObject } from "./IWorldObject";
import { type IWorldObjectsIterator } from "./IWorldObjectsIterator";
import { type IVector3D } from "@shared/common/utils";

export interface IWorldObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export interface IWorldObjectCreateOptions extends IBaseObjectCreateOptions {
  position: IVector3D;
  dimension: number;
}

export interface IWorldObjectsManager<T extends IWorldObject> extends IBaseObjectsManager<T> {
  get iterator(): IWorldObjectsIterator<T>;
}
