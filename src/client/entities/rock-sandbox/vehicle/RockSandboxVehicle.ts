import { type VehicleIndicatorMode, type VehicleHeadlightMode } from "../../../../shared/common/vehicle-lights";
import { type IVehicle, type ILightState } from "../../common/vehicle/IVehicle";
import { type IRGB } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

import { type RockSandboxVehicle as NativeVehicle } from "@rock-sandbox/types/client";
import { BaseObjectType } from "../../../../shared";
import { Vector3D, type IVector3D } from "../../../../shared/common/utils/math/Vectors";
export class RockSandboxVehicle extends RockSandboxEntity implements IVehicle {
  public get indicatorMode(): VehicleIndicatorMode {
    return this._nativeVehicle.indicatorMode;
  }
  public get indicatorPhaseOn(): boolean {
    return this._nativeVehicle.indicatorPhaseOn;
  }

  public get headlightMode(): VehicleHeadlightMode {
    return this._nativeVehicle.headlightMode;
  }

  public constructor(private readonly _nativeVehicle: NativeVehicle) {
    super();
  }

  public override getVariable(name: string): unknown {
    return this._nativeVehicle.getNetData(name);
  }

  public override getSyncedMeta(name: string): unknown {
    return this._nativeVehicle.getNetData(name);
  }

  public override hasSyncedMeta(name: string): boolean {
    return this._nativeVehicle.getNetData(name) !== undefined;
  }

  public override get id(): number {
    return this._nativeVehicle.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public override get isExists(): boolean {
    return this._nativeVehicle.isExists;
  }

  public override get model(): number {
    return this._nativeVehicle.modelHash;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeVehicle.position;
    return new Vector3D(x, -z, y);
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativeVehicle.rotation;
    return new Vector3D(x, -z, y);
  }

  public override get dimension(): number {
    return this._nativeVehicle.dimension;
  }

  public override get remoteId(): number {
    return this._nativeVehicle.id;
  }

  public override get handle(): number {
    return this._nativeVehicle.handle;
  }

  public override get heading(): number {
    return this._nativeVehicle.heading;
  }

  public override getSpeed(): number {
    return this._nativeVehicle.speed;
  }

  public get bodyHealth(): number {
    return this._nativeVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._nativeVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return this._nativeVehicle.numberPlate;
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

  public getPedInSeat(seat: number): number {
    return this._nativeVehicle.getPlayerInSeat(seat + 1)?.handle ?? 0;
  }

  public setUndriveable(_toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setUndriveable");
  }

  public get maxNumberOfPassengers(): number {
    return this._nativeVehicle.maxPassengers;
  }

  public get gear(): number {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.gear");
  }

  public get speed(): number {
    return this._nativeVehicle.speed;
  }

  public get isEngineRunning(): boolean {
    return this._nativeVehicle.engineOn;
  }

  public setEngineOn(_toggle: boolean, _instantly: boolean, _otherwise: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVehicle.setEngineOn");
  }

  public get lightsState(): ILightState {
    const state = this._nativeVehicle.headlightState;
    return { lightsOn: state !== "off", highbeamsOn: state === "high_beam" };
  }

  public get isLocked(): boolean {
    return this._nativeVehicle.isLocked;
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

const wrappers = new WeakMap<NativeVehicle, RockSandboxVehicle>();
export function wrapVehicle(vehicle: NativeVehicle): RockSandboxVehicle {
  const old = wrappers.get(vehicle);
  if (old) return old;
  const wrapper = new RockSandboxVehicle(vehicle);
  wrappers.set(vehicle, wrapper);
  return wrapper;
}
