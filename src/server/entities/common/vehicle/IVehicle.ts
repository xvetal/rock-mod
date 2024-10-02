import { IEntity, IEntityOptions } from "../entity/IEntity";

export enum VehicleSeat {
  NONE = 255,
  DRIVER,
  PASSENGER_1,
  PASSENGER_2,
  PASSENGER_3,
  PASSENGER_4,
  PASSENGER_5,
  PASSENGER_6,
  PASSENGER_7,
  PASSENGER_8,
  PASSENGER_9,
  PASSENGER_10,
  PASSENGER_11,
  PASSENGER_12,
  PASSENGER_13,
  PASSENGER_14,
  PASSENGER_15,
  PASSENGER_16,
}

export interface IVehicleOptions extends IEntityOptions {}

export interface IVehicle extends IEntity {
  get bodyHealth(): number;
  setBodyHealth(value: number): void;
}
