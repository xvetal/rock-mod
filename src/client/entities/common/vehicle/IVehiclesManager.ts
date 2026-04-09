import { type IEntitiesManager, type IEntityCreateOptions } from "../entity/IEntitiesManager";
import { type IRockModVehicle } from "./IRockModVehicle";

export interface IVehicleCreateOptions extends IEntityCreateOptions {
  engine: boolean;
  locked: boolean;
}

export interface IVehiclesManager extends IEntitiesManager<IRockModVehicle> {
  create(options: IVehicleCreateOptions): IRockModVehicle;
}
