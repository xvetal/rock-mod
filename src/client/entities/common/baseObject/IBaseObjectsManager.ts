import { BaseObjectType, IBaseObject } from "./IBaseObject";
import { IBaseObjectsIterator } from "./IBaseObjectsIterator";

export interface IBaseObjectsManagerOptions {
  baseObjectsType: `${BaseObjectType}`;
}

export interface IBaseObjectCreateOptions {}

export interface IBaseObjectsManager<T extends IBaseObject> {
  get iterator(): IBaseObjectsIterator<T>;
  getByID(id: number): T;
  findByID(id: number): T | null;
}
