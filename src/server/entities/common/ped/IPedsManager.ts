import { IEntitiesManager, IEntityCreateOptions } from "../entity";
import { IPed } from "./IPed";

export interface IPedCreateOptions extends IEntityCreateOptions {
  frozen: boolean;
}

export interface IPedsManager extends IEntitiesManager<IPed> {
  create(options: IPedCreateOptions): IPed;
}
