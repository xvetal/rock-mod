import { IBaseObjectsIterator } from "../baseObject/IBaseObjectsIterator";
import { IWorldObject } from "./IWorldObject";

export interface IWorldObjectsIterator<T extends IWorldObject> extends IBaseObjectsIterator<T> {
  dimension(value: number): IterableIterator<T>;
}
