import { type IEntitiesManager, type IEntityCreateOptions } from "../entity";
import { type IPed } from "./IPed";

export interface IPedCreateOptions extends IEntityCreateOptions {}

export interface IPedsManager extends IEntitiesManager<IPed> {
  create(options: IPedCreateOptions): IPed;
}
