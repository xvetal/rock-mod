import { IBaseObject } from "./IBaseObject";

export interface IBaseObjectsIterator<T extends IBaseObject> {
  all(): IterableIterator<T>;
}
