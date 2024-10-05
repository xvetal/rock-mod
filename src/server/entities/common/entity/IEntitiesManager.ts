import {
  IWorldObjectCreateOptions,
  IWorldObjectsManager,
  IWorldObjectsManagerOptions,
} from "../worldObject/IWorldObjectsManager";
import { IEntity } from "./IEntity";
import { IVector3D } from "../../../common/utils";

export interface IEntitiesManagerOptions extends IWorldObjectsManagerOptions {}

export interface IEntityCreateOptions extends IWorldObjectCreateOptions {
  model: string;
  rotation: IVector3D;
}

export interface IEntitiesManager<T extends IEntity> extends IWorldObjectsManager<T> {}
