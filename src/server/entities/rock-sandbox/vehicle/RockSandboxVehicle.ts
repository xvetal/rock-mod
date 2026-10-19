import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA } from "../../../../shared/common/utils";
import { type IPlayer } from "../../common/player";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxVehicle extends RockSandboxEntity implements IVehicle {
  public get bodyHealth(): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.bodyHealth");
  }

  public get engineHealth(): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.engineHealth");
  }

  public get numberPlate(): string {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.numberPlate");
  }

  public get isLocked(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.isLocked");
  }

  public get isDead(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.isDead");
  }

  public get primaryColor(): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.primaryColor");
  }

  public get secondaryColor(): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.secondaryColor");
  }

  public get customPrimaryColor(): IRGBA {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.customPrimaryColor");
  }

  public get customSecondaryColor(): IRGBA {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.customSecondaryColor");
  }

  public get driver(): IPlayer | null {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.driver");
  }

  public get passengers(): Set<IPlayer> {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.passengers");
  }

  public setBodyHealth(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setBodyHealth");
  }

  public setEngineHealth(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setEngineHealth");
  }

  public setEngineOn(_value: boolean): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setEngineOn");
  }

  public setNumberPlate(_value: string): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setNumberPlate");
  }

  public setLocked(_value: boolean): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setLocked");
  }

  public setPrimaryColor(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setPrimaryColor");
  }

  public setSecondaryColor(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setSecondaryColor");
  }

  public setCustomPrimaryColor(_value: IRGBA): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setCustomPrimaryColor");
  }

  public setCustomSecondaryColor(_value: IRGBA): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setCustomSecondaryColor");
  }

  public setMod(_modType: number, _modIndex: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setMod");
  }

  public getMod(_modType: number): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.getMod");
  }

  public setNeonEnabled(_enabled: boolean): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setNeonEnabled");
  }

  public setNeonColor(_r: number, _g: number, _b: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setNeonColor");
  }

  public setWindowTint(_tintType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setWindowTint");
  }

  public setWheelType(_wheelType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setWheelType");
  }

  public setPlateType(_plateType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setPlateType");
  }

  public explode(): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.explode");
  }

  public repair(): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.repair");
  }
}
