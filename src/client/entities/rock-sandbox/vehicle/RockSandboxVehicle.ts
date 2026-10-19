import { type IVehicle, type ILightState } from "../../common/vehicle/IVehicle";
import { type IRGB } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxVehicle extends RockSandboxEntity implements IVehicle {
  public get bodyHealth(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.bodyHealth");
  }

  public get engineHealth(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.engineHealth");
  }

  public get numberPlate(): string {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.numberPlate");
  }

  public get isDead(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.isDead");
  }

  public setBodyHealth(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setBodyHealth");
  }

  public setEngineHealth(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setEngineHealth");
  }

  public setNumberPlate(_value: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setNumberPlate");
  }

  public explode(): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.explode");
  }

  public getPedInSeat(_seat: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getPedInSeat");
  }

  public setUndriveable(_toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setUndriveable");
  }

  public get maxNumberOfPassengers(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.maxNumberOfPassengers");
  }

  public get gear(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.gear");
  }

  public get speed(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.speed");
  }

  public get isEngineRunning(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.isEngineRunning");
  }

  public setEngineOn(_toggle: boolean, _instantly: boolean, _otherwise: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setEngineOn");
  }

  public get lightsState(): ILightState {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.lightsState");
  }

  public get isLocked(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.isLocked");
  }

  public setIsLocked(_value: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setIsLocked");
  }

  public setCustomPrimaryColour(_color: IRGB): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setCustomPrimaryColour");
  }

  public setCustomSecondaryColour(_color: IRGB): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setCustomSecondaryColour");
  }

  public get customPrimaryColour(): IRGB {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.customPrimaryColour");
  }

  public get customSecondaryColour(): IRGB {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.customSecondaryColour");
  }

  public setMod(_modType: number, _modIndex: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setMod");
  }

  public getMod(_modType: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getMod");
  }

  public getNumMods(_modType: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getNumMods");
  }

  public setNeonLightEnabled(_index: number, _toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setNeonLightEnabled");
  }

  public setNeonLightsColour(_color: IRGB): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setNeonLightsColour");
  }

  public setWindowTint(_tintType: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setWindowTint");
  }

  public get windowTint(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.windowTint");
  }

  public setWheelType(_wheelType: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setWheelType");
  }

  public get wheelType(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.wheelType");
  }

  public setNumberPlateType(_index: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setNumberPlateType");
  }

  public get numberPlateType(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.numberPlateType");
  }

  public setDoorOpen(_doorIndex: number, _loose: boolean, _openInstantly: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setDoorOpen");
  }

  public setDoorShut(_doorIndex: number, _instantly: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setDoorShut");
  }

  public setHandling(_field: string, _value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setHandling");
  }

  public getHandling(_field: string): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getHandling");
  }

  public setEnginePowerMultiplier(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setEnginePowerMultiplier");
  }

  public setEngineTorqueMultiplier(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setEngineTorqueMultiplier");
  }

  public modifyTopSpeed(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.modifyTopSpeed");
  }

  public setCheatPowerIncrease(_value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setCheatPowerIncrease");
  }

  public toggleMod(_modType: number, _toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.toggleMod");
  }

  public setTyreSmokeColor(_r: number, _g: number, _b: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setTyreSmokeColor");
  }

  public setModColor1(_paintType: number, _color: number, _p3: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setModColor1");
  }

  public setExtraColours(_pearlescentColor: number, _wheelColor: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setExtraColours");
  }

  public setHeadlightColor(_colorIndex: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setHeadlightColor");
  }

  public setDashboardColor(_colorIndex: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setDashboardColor");
  }

  public setInteriorColor(_colorIndex: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setInteriorColor");
  }

  public getMaxBraking(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getMaxBraking");
  }

  public getAcceleration(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getAcceleration");
  }

  public getMaxTraction(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getMaxTraction");
  }

  public getModelMaxSpeed(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.getModelMaxSpeed");
  }
}
