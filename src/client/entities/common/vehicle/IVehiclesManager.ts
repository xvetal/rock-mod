import { IEntitiesManager, IEntityCreateOptions } from "../entity/IEntitiesManager";
import { IVehicle } from "./IVehicle";

export interface IVehicleCreateOptions extends IEntityCreateOptions {
  engine: boolean;
  locked: boolean;
}

export interface IVehiclesManager extends IEntitiesManager<IVehicle> {
  create(options: IVehicleCreateOptions): IVehicle;
}
