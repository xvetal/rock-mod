import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type ILightState, type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGB, RGBA } from "@shared/index";

export interface IRageVehicleOptions extends IRageEntityOptions<VehicleMp> {}

export class RageVehicle extends RageEntity<VehicleMp> implements IVehicle {
  public get bodyHealth(): number {
    return this.mpEntity.getBodyHealth();
  }

  public get engineHealth(): number {
    return this.mpEntity.getEngineHealth();
  }

  public get numberPlate(): string {
    return this.mpEntity.getNumberPlateText();
  }

  public get isDead(): boolean {
    return this.mpEntity.isDead();
  }

  public constructor(options: IRageVehicleOptions) {
    super(options);
  }

  public setBodyHealth(value: number): void {
    this.mpEntity.setBodyHealth(value);
  }

  public setEngineHealth(value: number): void {
    this.mpEntity.setEngineHealth(value);
  }

  public setNumberPlate(value: string): void {
    this.mpEntity.setNumberPlateText(value);
  }

  public explode(): void {
    return this.mpEntity.explode(true, true);
  }

  public getPedInSeat(seat: number): number {
    return this.mpEntity.getPedInSeat(seat);
  }

  public get gear(): number {
    return this.mpEntity.gear;
  }

  public get speed(): number {
    return this.mpEntity.getSpeed();
  }

  public get isEngineRunning(): boolean {
    return this.mpEntity.getIsEngineRunning();
  }

  public get lightsState(): ILightState {
    return this.mpEntity.getLightsState(1, 1);
  }

  public setUndriveable(toggle: boolean): void {
    this.mpEntity.setUndriveable(toggle);
  }

  public get maxNumberOfPassengers(): number {
    return this.mpEntity.getMaxNumberOfPassengers();
  }

  public setEngineOn(toggle: boolean, instantly: boolean, otherwise: boolean): void {
    this.mpEntity.setEngineOn(toggle, instantly, otherwise);
  }

  public get isLocked(): boolean {
    return this.mpEntity.locked;
  }

  public setIsLocked(value: boolean): void {
    this.mpEntity.locked = value;
  }

  public setCustomPrimaryColour(color: IRGB): void {
    this.mpEntity.setCustomPrimaryColour(color.r, color.g, color.b);
  }

  public setCustomSecondaryColour(color: IRGB): void {
    this.mpEntity.setCustomSecondaryColour(color.r, color.g, color.b);
  }

  public get customPrimaryColour(): IRGB {
    const color = this.mpEntity.getCustomPrimaryColour(0, 0, 0);
    return new RGBA(color.r, color.g, color.b);
  }

  public get customSecondaryColour(): IRGB {
    const color = this.mpEntity.getCustomSecondaryColour(0, 0, 0);
    return new RGBA(color.r, color.g, color.b);
  }

  public setMod(modType: number, modIndex: number): void {
    this.mpEntity.setMod(modType, modIndex);
  }

  public getMod(modType: number): number {
    return this.mpEntity.getMod(modType);
  }

  public getNumMods(modType: number): number {
    return this.mpEntity.getNumMods(modType);
  }

  public setNeonLightEnabled(index: number, toggle: boolean): void {
    this.mpEntity.setNeonLightEnabled(index, toggle);
  }

  public setNeonLightsColour(color: IRGB): void {
    this.mpEntity.setNeonLightsColour(color.r, color.g, color.b);
  }

  public setWindowTint(tintType: number): void {
    this.mpEntity.setWindowTint(tintType);
  }

  public get windowTint(): number {
    return this.mpEntity.getWindowTint();
  }

  public setWheelType(wheelType: number): void {
    this.mpEntity.setWheelType(wheelType);
  }

  public get wheelType(): number {
    return this.mpEntity.getWheelType();
  }

  public setNumberPlateTextIndex(index: number): void {
    this.mpEntity.setNumberPlateTextIndex(index);
  }

  public get numberPlateTextIndex(): number {
    return this.mpEntity.getNumberPlateTextIndex();
  }

  public setDoorOpen(doorIndex: number, loose: boolean, openInstantly: boolean): void {
    this.mpEntity.setDoorOpen(doorIndex, loose, openInstantly);
  }

  public setDoorShut(doorIndex: number, instantly: boolean): void {
    this.mpEntity.setDoorShut(doorIndex, instantly);
  }

  public setHandling(field: string, value: number): void {
    this.mpEntity.setHandling(field, value);
  }

  public getHandling(field: string): number {
    return this.mpEntity.getHandling(field) as number;
  }

  public setEnginePowerMultiplier(value: number): void {
    this.mpEntity.setEnginePowerMultiplier(value);
  }

  public setEngineTorqueMultiplier(value: number): void {
    this.mpEntity.setEngineTorqueMultiplier(value);
  }

  public modifyTopSpeed(value: number): void {
    mp.game.vehicle.modifyTopSpeed(this.handle, value);
  }

  public setCheatPowerIncrease(value: number): void {
    mp.game.vehicle.setCheatPowerIncrease(this.handle, value);
  }

  public toggleMod(modType: number, toggle: boolean): void {
    this.mpEntity.toggleMod(modType, toggle);
  }

  public setTyreSmokeColor(r: number, g: number, b: number): void {
    this.mpEntity.setTyreSmokeColor(r, g, b);
  }

  public setModColor1(paintType: number, color: number, p3: number): void {
    this.mpEntity.setModColor1(paintType, color, p3);
  }

  public setExtraColours(pearlescentColor: number, wheelColor: number): void {
    this.mpEntity.setExtraColours(pearlescentColor, wheelColor);
  }

  public setHeadlightColor(colorIndex: number): void {
    // _SET_VEHICLE_HEADLIGHT_COLOUR — no RAGEMP wrapper, invoke native by hash
    mp.game.invoke("0xE41033B25D003A07", this.handle, colorIndex);
  }

  public setDashboardColor(colorIndex: number): void {
    // SET_VEHICLE_DASHBOARD_COLOUR — no RAGEMP wrapper, invoke native by hash
    mp.game.invoke("0x6089CDF6A57F326C", this.handle, colorIndex);
  }

  public setInteriorColor(colorIndex: number): void {
    // SET_VEHICLE_INTERIOR_COLOUR — no RAGEMP wrapper, invoke native by hash
    mp.game.invoke("0xF40DD601A65F7F19", this.handle, colorIndex);
  }

  public getMaxBraking(): number {
    return this.mpEntity.getMaxBraking();
  }

  public getAcceleration(): number {
    return this.mpEntity.getAcceleration();
  }

  public getMaxTraction(): number {
    return this.mpEntity.getMaxTraction();
  }

  public getModelMaxSpeed(): number {
    return mp.game.vehicle.getVehicleModelMaxSpeed(this.mpEntity.model);
  }
}
