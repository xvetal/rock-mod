import { IEntitiesManager, IEntityCreateOptions } from "../entity";
import { IObject } from "./IObject";

export interface IObjectCreateOptions extends IEntityCreateOptions {
  alpha: number;
}

export interface IObjectsManager extends IEntitiesManager<IObject> {
  create(options: IObjectCreateOptions): IObject;
}
