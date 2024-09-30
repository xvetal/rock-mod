import { BaseObjectType, IBaseObject } from "./IBaseObject";
import { IBaseObjectsIterator } from "./IBaseObjectsIterator";
import { INetManager } from "../../../net/common/INetManager";

export interface IBaseObjectsManagerOptions {
  baseObjectsType: `${BaseObjectType}`;
  net: INetManager;
}

export interface IBaseObjectsManager<T extends IBaseObject> {
  get iterator(): IBaseObjectsIterator<T>;
  getByID(id: number): T;
  findByID(id: number): T | null;
}
