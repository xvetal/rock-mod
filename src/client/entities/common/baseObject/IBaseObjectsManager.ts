import { type IBaseObject } from "./IBaseObject";
import { type IBaseObjectsIterator } from "./IBaseObjectsIterator";
import { type BaseObjectType } from "@shared/entities";

export interface IBaseObjectsManagerOptions {
  baseObjectsType: `${BaseObjectType}`;
}

export interface IBaseObjectCreateOptions {}

export interface IBaseObjectsManager<T extends IBaseObject> {
  get iterator(): IBaseObjectsIterator<T>;
  getByID(id: number): T;
  findByID(id: number): T | null;
}
