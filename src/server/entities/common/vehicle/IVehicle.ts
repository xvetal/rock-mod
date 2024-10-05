import { IEntity, IEntityOptions } from "../entity/IEntity";
import { IRGBA } from "../../../common/utils";
import { IPlayer } from "../player";

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
  get engineHealth(): number;
  get numberPlate(): string;
  get isLocked(): boolean;
  get isDead(): boolean;
  get primaryColor(): number;
  get secondaryColor(): number;
  get customPrimaryColor(): IRGBA;
  get customSecondaryColor(): IRGBA;
  get driver(): IPlayer | null;
  get passengers(): Set<IPlayer>;
  setBodyHealth(value: number): void;
  setEngineHealth(value: number): void;
  setNumberPlate(value: string): void;
  setLocked(value: boolean): void;
  setPrimaryColor(value: number): void;
  setSecondaryColor(value: number): void;
  setCustomPrimaryColor(value: IRGBA): void;
  setCustomSecondaryColor(value: IRGBA): void;
  explode(): void;
  repair(): void;
}
