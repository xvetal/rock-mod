import { type IEntitiesManager, type IEntityCreateOptions } from "../entity";
import { type IPed } from "./IPed";

export interface IPedCreateOptions extends IEntityCreateOptions {
  frozen: boolean;
  invincible?: boolean;
  placeOnGround?: boolean;
}

export interface IPedsManager extends IEntitiesManager<IPed> {
  create(options: IPedCreateOptions): IPed;
}
