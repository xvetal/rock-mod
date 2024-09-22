import { IEntity, IEntityOptions } from "../entity/IEntity";

export interface IVehicleOptions extends IEntityOptions {}

export interface IVehicle extends IEntity {
  get bodyHealth(): number;
  set bodyHealth(health: number);
}
