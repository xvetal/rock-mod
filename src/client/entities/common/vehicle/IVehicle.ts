import { type IEntity, type IEntityOptions } from "../entity/IEntity";
import { type IRGB } from "@shared/common/utils";

export interface IVehicleOptions extends IEntityOptions {}

export interface ILightState {
  lightsOn: boolean;
  highbeamsOn: boolean;
}

export interface IVehicle extends IEntity {
  get bodyHealth(): number;
  get engineHealth(): number;
  get numberPlate(): string;
  get isDead(): boolean;
  setBodyHealth(value: number): void;
  setEngineHealth(value: number): void;
  setNumberPlate(value: string): void;
  explode(): void;

  getPedInSeat(seat: number): number;
  setUndriveable(toggle: boolean): void;
  get maxNumberOfPassengers(): number;

  get gear(): number;
  get speed(): number;
  get isEngineRunning(): boolean;
  setEngineOn(toggle: boolean, instantly: boolean, otherwise: boolean): void;
  get lightsState(): ILightState;
  get isLocked(): boolean;
  setIsLocked(value: boolean): void;

  setCustomPrimaryColour(color: IRGB): void;
  setCustomSecondaryColour(color: IRGB): void;
  get customPrimaryColour(): IRGB;
  get customSecondaryColour(): IRGB;

  setMod(modType: number, modIndex: number): void;
  getMod(modType: number): number;
  getNumMods(modType: number): number;
  setNeonLightEnabled(index: number, toggle: boolean): void;
  setNeonLightsColour(color: IRGB): void;
  setWindowTint(tintType: number): void;
  get windowTint(): number;
  setWheelType(wheelType: number): void;
  get wheelType(): number;
  setNumberPlateTextIndex(index: number): void;
  get numberPlateTextIndex(): number;

  setDoorOpen(doorIndex: number, loose: boolean, openInstantly: boolean): void;
  setDoorShut(doorIndex: number, instantly: boolean): void;

  setHandling(field: string, value: number): void;
  getHandling(field: string): number;
  setEnginePowerMultiplier(value: number): void;
  setEngineTorqueMultiplier(value: number): void;
  modifyTopSpeed(value: number): void;
  setCheatPowerIncrease(value: number): void;

  toggleMod(modType: number, toggle: boolean): void;
  setTyreSmokeColor(r: number, g: number, b: number): void;
  setModColor1(paintType: number, color: number, p3: number): void;
  setExtraColours(pearlescentColor: number, wheelColor: number): void;
  setHeadlightColor(colorIndex: number): void;
  setDashboardColor(colorIndex: number): void;
  setInteriorColor(colorIndex: number): void;
  getMaxBraking(): number;
  getAcceleration(): number;
  getMaxTraction(): number;
  getModelMaxSpeed(): number;
}
