import { BaseObjectType, IBaseObject } from "./IBaseObject";

export interface IBaseObjectsManagerOptions {
  baseObjectsType: `${BaseObjectType}`;
}

export interface IBaseObjectsManager<T extends IBaseObject> {
  getByID(id: number): T;
  findByID(id: number): T | null;
}
