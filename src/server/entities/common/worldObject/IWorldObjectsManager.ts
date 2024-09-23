import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../baseObject/IBaseObjectsManager";
import { IWorldObject } from "./IWorldObject";

export interface IWorldObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export interface IWorldObjectsManager<T extends IWorldObject> extends IBaseObjectsManager<T> {}
