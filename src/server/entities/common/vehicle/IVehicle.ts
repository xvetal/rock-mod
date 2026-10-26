import { type IEntity, type IEntityOptions } from "../entity/IEntity";
import { type IRGBA } from "../../../../shared/common/utils";
import { type IPlayer } from "../player";
import { type VehicleHeadlightMode } from "../../../../shared/common/vehicle-lights";

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
  /** Native headlight modes; unsupported on the legacy backends. */
  get headlightMode(): VehicleHeadlightMode;
  setHeadlightMode(mode: VehicleHeadlightMode): void;
  get bodyHealth(): number;
  get engineHealth(): number;
  get numberPlate(): string;
  get isLocked(): boolean;
  get isDead(): boolean;
  /** RockSandbox uses -1 when the model retains its authored base paint. */
  get primaryColor(): number;
  get secondaryColor(): number;
  get customPrimaryColor(): IRGBA | null;
  get customSecondaryColor(): IRGBA | null;
  get driver(): IPlayer | null;
  get passengers(): Set<IPlayer>;
  setBodyHealth(value: number): void;
  setEngineHealth(value: number): void;
  setEngineOn(value: boolean): void;
  setNumberPlate(value: string): void;
  setLocked(value: boolean): void;
  setPrimaryColor(value: number): void;
  setSecondaryColor(value: number): void;
  setCustomPrimaryColor(value: IRGBA): void;
  setCustomSecondaryColor(value: IRGBA): void;
  setMod(modType: number, modIndex: number): void;
  getMod(modType: number): number;
  setNeonEnabled(enabled: boolean): void;
  setNeonColor(r: number, g: number, b: number): void;
  setWindowTint(tintType: number): void;
  setWheelType(wheelType: number): void;
  setPlateType(plateType: number): void;
  explode(): void;
  repair(): void;
}
