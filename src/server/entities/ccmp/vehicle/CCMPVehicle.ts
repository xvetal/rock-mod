import { CCMPEntity } from "../entity/CCMPEntity";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA } from "../../../../shared/common/utils";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { BaseObjectType } from "../../../../shared";
import { RockMod } from "../../../RockMod";
import { type CCMPPlayer } from "../player/CCMPPlayer";
import type { Vehicle as CcmpVehicle } from "@classic-mp/types/server";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPVehicleOptions {
  ccmpVehicle: CcmpVehicle;
  onDestroy: (vehicle: CCMPVehicle) => void;
}

export class CCMPVehicle extends CCMPEntity implements IVehicle {
  private readonly _ccmpVehicle: CcmpVehicle;

  private readonly _onDestroy: (vehicle: CCMPVehicle) => void;

  public override get id(): number {
    return this._ccmpVehicle.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public override get isExists(): boolean {
    return this._ccmpVehicle.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpVehicle.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpVehicle.dimension;
  }

  public override get model(): number {
    return this._ccmpVehicle.model;
  }

  public override get rotation(): IVector3D {
    const r = this._ccmpVehicle.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

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
    const ccmpDriver = this._ccmpVehicle.driver;
    if (!ccmpDriver) return null;
    return RockMod.instance.players.findByID(ccmpDriver.id) as CCMPPlayer | null;
  }

  public get passengers(): Set<CCMPPlayer> {
    const passengers = new Set<CCMPPlayer>();
    for (const ccmpPassenger of this._ccmpVehicle.passengers) {
      const player = RockMod.instance.players.findByID(ccmpPassenger.id) as CCMPPlayer | null;
      if (player) {
        passengers.add(player);
      }
    }
    return passengers;
  }

  protected override get ccmpMeta(): CcmpVehicle {
    return this._ccmpVehicle;
  }

  public constructor(options: ICCMPVehicleOptions) {
    super();
    this._ccmpVehicle = options.ccmpVehicle;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpVehicle.isExists) return;
    this._ccmpVehicle.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpVehicle.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._ccmpVehicle.dimension = value;
  }

  public override setModel(value: string): void {
    this._ccmpVehicle.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    this._ccmpVehicle.rotation = { x: value.x, y: value.y, z: value.z };
  }

  public setBodyHealth(_value: number): void {
    notImplemented("CCMPVehicle.setBodyHealth");
  }

  public setEngineHealth(_value: number): void {
    notImplemented("CCMPVehicle.setEngineHealth");
  }

  public setEngineOn(value: boolean): void {
    this._ccmpVehicle.engineOn = value;
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
