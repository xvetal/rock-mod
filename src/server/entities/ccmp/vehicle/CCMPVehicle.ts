import { CCMPEntity } from "../entity/CCMPEntity";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA } from "../../../../shared/common/utils";
import { type CCMPPlayer } from "../player/CCMPPlayer";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPVehicle extends CCMPEntity implements IVehicle {
  public get bodyHealth(): number {
    return notImplemented("CCMPVehicle.bodyHealth");
  }

  public get engineHealth(): number {
    return notImplemented("CCMPVehicle.engineHealth");
  }

  public get numberPlate(): string {
    return notImplemented("CCMPVehicle.numberPlate");
  }

  public get isLocked(): boolean {
    return notImplemented("CCMPVehicle.isLocked");
  }

  public get isDead(): boolean {
    return notImplemented("CCMPVehicle.isDead");
  }

  public get primaryColor(): number {
    return notImplemented("CCMPVehicle.primaryColor");
  }

  public get secondaryColor(): number {
    return notImplemented("CCMPVehicle.secondaryColor");
  }

  public get customPrimaryColor(): IRGBA {
    return notImplemented("CCMPVehicle.customPrimaryColor");
  }

  public get customSecondaryColor(): IRGBA {
    return notImplemented("CCMPVehicle.customSecondaryColor");
  }

  public get driver(): CCMPPlayer | null {
    return notImplemented("CCMPVehicle.driver");
  }

  public get passengers(): Set<CCMPPlayer> {
    return notImplemented("CCMPVehicle.passengers");
  }

  public setBodyHealth(_value: number): void {
    notImplemented("CCMPVehicle.setBodyHealth");
  }

  public setEngineHealth(_value: number): void {
    notImplemented("CCMPVehicle.setEngineHealth");
  }

  public setEngineOn(_value: boolean): void {
    notImplemented("CCMPVehicle.setEngineOn");
  }

  public setNumberPlate(_value: string): void {
    notImplemented("CCMPVehicle.setNumberPlate");
  }

  public setLocked(_value: boolean): void {
    notImplemented("CCMPVehicle.setLocked");
  }

  public setPrimaryColor(_value: number): void {
    notImplemented("CCMPVehicle.setPrimaryColor");
  }

  public setSecondaryColor(_value: number): void {
    notImplemented("CCMPVehicle.setSecondaryColor");
  }

  public setCustomPrimaryColor(_value: IRGBA): void {
    notImplemented("CCMPVehicle.setCustomPrimaryColor");
  }

  public setCustomSecondaryColor(_value: IRGBA): void {
    notImplemented("CCMPVehicle.setCustomSecondaryColor");
  }

  public setMod(_modType: number, _modIndex: number): void {
    notImplemented("CCMPVehicle.setMod");
  }

  public getMod(_modType: number): number {
    return notImplemented("CCMPVehicle.getMod");
  }

  public setNeonEnabled(_enabled: boolean): void {
    notImplemented("CCMPVehicle.setNeonEnabled");
  }

  public setNeonColor(_r: number, _g: number, _b: number): void {
    notImplemented("CCMPVehicle.setNeonColor");
  }

  public setWindowTint(_tintType: number): void {
    notImplemented("CCMPVehicle.setWindowTint");
  }

  public setWheelType(_wheelType: number): void {
    notImplemented("CCMPVehicle.setWheelType");
  }

  public setPlateType(_plateType: number): void {
    notImplemented("CCMPVehicle.setPlateType");
  }

  public explode(): void {
    notImplemented("CCMPVehicle.explode");
  }

  public repair(): void {
    notImplemented("CCMPVehicle.repair");
  }
}
