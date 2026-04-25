import { type IEntitiesManager, type IEntityCreateOptions } from "../entity/IEntitiesManager";
import { type IVehicle } from "./IVehicle";

export interface IVehicleCreateOptions extends IEntityCreateOptions {
  engine: boolean;
  locked: boolean;
}

export interface IVehiclesManager extends IEntitiesManager<IVehicle> {
  create(options: IVehicleCreateOptions): IVehicle;
  getDisplayNameFromVehicleModel(modelHash: number): string;
}
