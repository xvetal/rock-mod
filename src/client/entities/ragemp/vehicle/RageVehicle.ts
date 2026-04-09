import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type ILightState, type IRockModVehicle } from "../../common/vehicle/IRockModVehicle";
import { type IRGB, RGBA } from "@shared/index";

export interface IRageVehicleOptions extends IRageEntityOptions<VehicleMp> {}

export class RageVehicle extends RageEntity<VehicleMp> implements IRockModVehicle {
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
}
