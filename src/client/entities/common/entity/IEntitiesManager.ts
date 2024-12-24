import {
  type IWorldObjectCreateOptions,
  type IWorldObjectsManager,
  type IWorldObjectsManagerOptions,
} from "../worldObject/IWorldObjectsManager";
import { type IEntity } from "./IEntity";
import { type IVector3D } from "@shared/common/utils";

export interface IEntitiesManagerOptions extends IWorldObjectsManagerOptions {}

export interface IEntityCreateOptions extends IWorldObjectCreateOptions {
  model: string;
  rotation: IVector3D;
}

export interface IEntitiesManager<T extends IEntity> extends IWorldObjectsManager<T> {}
