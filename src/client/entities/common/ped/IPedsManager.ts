import { type IEntitiesManager, type IEntityCreateOptions } from "../entity";
import { type IRockModPed } from "./IRockModPed";

export interface IPedCreateOptions extends IEntityCreateOptions {}

export interface IPedsManager extends IEntitiesManager<IRockModPed> {
  create(options: IPedCreateOptions): IRockModPed;
}
