import { CCMPEntity } from "../entity/CCMPEntity";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA, RGBA } from "../../../../shared/common/utils";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { BaseObjectType } from "../../../../shared";
import { RockMod } from "../../../RockMod";
import { type CCMPPlayer } from "../player/CCMPPlayer";
import type { Vehicle as CcmpVehicle } from "@classic-mp/types/server";

export interface ICCMPVehicleOptions {
  ccmpVehicle: CcmpVehicle;
  onDestroy: (vehicle: CCMPVehicle) => void;
}

type CcmpVehicleWithNumberPlate = CcmpVehicle & {
  numberPlate: string;
};

export class CCMPVehicle extends CCMPEntity implements IVehicle {
  private static readonly _customPrimaryColorMeta = "rockMod:customPrimaryColor";

  private static readonly _customSecondaryColorMeta = "rockMod:customSecondaryColor";

  private static readonly _vehicleModsMeta = "rockMod:vehicleMods";

  private static readonly _neonEnabledMeta = "rockMod:neonEnabled";

  private static readonly _neonColorMeta = "rockMod:neonColor";

  private static readonly _windowTintMeta = "rockMod:windowTint";

  private static readonly _wheelTypeMeta = "rockMod:wheelType";

  private readonly _ccmpVehicle: CcmpVehicle;

  private readonly _onDestroy: (vehicle: CCMPVehicle) => void;

  private readonly _mods = new Map<number, number>();

  private _customPrimaryColor = new RGBA(0, 0, 0);

  private _customSecondaryColor = new RGBA(0, 0, 0);

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
    return this._ccmpVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._ccmpVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return (this._ccmpVehicle as CcmpVehicleWithNumberPlate).numberPlate;
  }

  public get isLocked(): boolean {
    const lockState = this._ccmpVehicle.lockState;
    return lockState !== 0 && lockState !== 1;
  }

  public get isDead(): boolean {
    return !this.isExists || this.bodyHealth <= 0;
  }

  public get primaryColor(): number {
    return this._ccmpVehicle.primaryColor;
  }

  public get secondaryColor(): number {
    return this._ccmpVehicle.secondaryColor;
  }

  public get customPrimaryColor(): IRGBA {
    return this._customPrimaryColor;
  }

  public get customSecondaryColor(): IRGBA {
    return this._customSecondaryColor;
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
    this._restoreCompatibilityState();
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

  public setBodyHealth(value: number): void {
    this._ccmpVehicle.bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    this._ccmpVehicle.engineHealth = value;
  }

  public setEngineOn(value: boolean): void {
    this._ccmpVehicle.engineOn = value;
  }

  public setNumberPlate(value: string): void {
    (this._ccmpVehicle as CcmpVehicleWithNumberPlate).numberPlate = value;
  }

  public setLocked(value: boolean): void {
    this._ccmpVehicle.lockState = value ? 2 : 1;
  }

  public setPrimaryColor(value: number): void {
    this._ccmpVehicle.primaryColor = value;
  }

  public setSecondaryColor(value: number): void {
    this._ccmpVehicle.secondaryColor = value;
  }

  public setCustomPrimaryColor(value: IRGBA): void {
    this._customPrimaryColor = this._toRgba(value);
    this._setCompatibilityMeta(CCMPVehicle._customPrimaryColorMeta, this._customPrimaryColor);
  }

  public setCustomSecondaryColor(value: IRGBA): void {
    this._customSecondaryColor = this._toRgba(value);
    this._setCompatibilityMeta(CCMPVehicle._customSecondaryColorMeta, this._customSecondaryColor);
  }

  public setMod(modType: number, modIndex: number): void {
    this._mods.set(Math.trunc(modType), Math.trunc(modIndex));
    this._setCompatibilityMeta(CCMPVehicle._vehicleModsMeta, Object.fromEntries(this._mods));
  }

  public getMod(modType: number): number {
    return this._mods.get(Math.trunc(modType)) ?? -1;
  }

  public setNeonEnabled(enabled: boolean): void {
    this._setCompatibilityMeta(CCMPVehicle._neonEnabledMeta, enabled);
  }

  public setNeonColor(r: number, g: number, b: number): void {
    this._setCompatibilityMeta(CCMPVehicle._neonColorMeta, new RGBA(r, g, b));
  }

  public setWindowTint(tintType: number): void {
    this._setCompatibilityMeta(CCMPVehicle._windowTintMeta, Math.trunc(tintType));
  }

  public setWheelType(wheelType: number): void {
    this._setCompatibilityMeta(CCMPVehicle._wheelTypeMeta, Math.trunc(wheelType));
  }

  public setPlateType(plateType: number): void {
    this._ccmpVehicle.numberPlateType = plateType;
  }

  public explode(): void {
    this._ccmpVehicle.bodyHealth = 0;
    this._ccmpVehicle.engineHealth = -4000;
    this._ccmpVehicle.engineOn = false;
  }

  public repair(): void {
    this._ccmpVehicle.bodyHealth = 1000;
    this._ccmpVehicle.engineHealth = 1000;
  }

  private _restoreCompatibilityState(): void {
    this._customPrimaryColor = this._readColorMeta(CCMPVehicle._customPrimaryColorMeta);
    this._customSecondaryColor = this._readColorMeta(CCMPVehicle._customSecondaryColorMeta);

    const mods = this._ccmpVehicle.getStreamSyncedMeta<Record<string, unknown>>(CCMPVehicle._vehicleModsMeta);
    if (!mods || typeof mods !== "object") return;
    for (const [key, value] of Object.entries(mods)) {
      const modType = Number(key);
      const modIndex = Number(value);
      if (Number.isFinite(modType) && Number.isFinite(modIndex)) {
        this._mods.set(Math.trunc(modType), Math.trunc(modIndex));
      }
    }
  }

  private _readColorMeta(key: string): RGBA {
    const value = this._ccmpVehicle.getStreamSyncedMeta<Partial<IRGBA>>(key);
    if (!value || typeof value !== "object") {
      return new RGBA(0, 0, 0);
    }

    return new RGBA(Number(value.r) || 0, Number(value.g) || 0, Number(value.b) || 0, value.a);
  }

  private _setCompatibilityMeta(key: string, value: unknown): void {
    this._ccmpVehicle.setStreamSyncedMeta(key, value);
  }

  private _toRgba(value: IRGBA): RGBA {
    return new RGBA(value.r, value.g, value.b, value.a);
  }
}
