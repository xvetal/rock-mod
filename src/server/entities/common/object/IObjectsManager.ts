import { type IEntitiesManager, type IEntityCreateOptions } from "../entity";
import { type IObject } from "./IObject";

export interface IObjectCreateOptions extends IEntityCreateOptions {
  alpha: number;
  placeOnGround?: boolean;
}

export interface IObjectsManager extends IEntitiesManager<IObject> {
  create(options: IObjectCreateOptions): IObject;
}
