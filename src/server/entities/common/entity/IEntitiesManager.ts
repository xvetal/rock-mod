import { IWorldObjectsManager, IWorldObjectsManagerOptions } from "../worldObject/IWorldObjectsManager";
import { IEntity } from "./IEntity";

export interface IEntitiesManagerOptions extends IWorldObjectsManagerOptions {}

export interface IEntitiesManager<T extends IEntity> extends IWorldObjectsManager<T> {}
