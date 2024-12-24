import { type IEntity, type IEntityOptions } from "../entity/IEntity";

export interface IVehicleOptions extends IEntityOptions {}

export interface IVehicle extends IEntity {
  get bodyHealth(): number;
  get engineHealth(): number;
  get numberPlate(): string;
  get isDead(): boolean;
  setBodyHealth(value: number): void;
  setEngineHealth(value: number): void;
  setNumberPlate(value: string): void;
  explode(): void;
}
