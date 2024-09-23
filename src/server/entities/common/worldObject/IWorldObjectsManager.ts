import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../baseObject/IBaseObjectsManager";
import { IWorldObject } from "./IWorldObject";
import { IWorldObjectsIterator } from "./IWorldObjectsIterator";

export interface IWorldObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export interface IWorldObjectsManager<T extends IWorldObject> extends IBaseObjectsManager<T> {
  get iterator(): IWorldObjectsIterator<T>;
}
