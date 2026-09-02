import { VIMPEntity } from "../entity/VIMPEntity";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA, RGBA } from "../../../../shared/common/utils";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { BaseObjectType } from "../../../../shared";
import { RockMod } from "../../../RockMod";
import { type VIMPPlayer } from "../player/VIMPPlayer";
import type { Vehicle as VimpVehicle } from "@vimp-mp/types/server";

export interface IVIMPVehicleOptions {
  vimpVehicle: VimpVehicle;
  onDestroy: (vehicle: VIMPVehicle) => void;
}

type VimpVehicleWithNumberPlate = VimpVehicle & {
  numberPlate: string;
};

export class VIMPVehicle extends VIMPEntity implements IVehicle {
  private static readonly _customPrimaryColorMeta = "rockMod:customPrimaryColor";

  private static readonly _customSecondaryColorMeta = "rockMod:customSecondaryColor";

  private static readonly _vehicleModsMeta = "rockMod:vehicleMods";

  private static readonly _neonEnabledMeta = "rockMod:neonEnabled";

  private static readonly _neonColorMeta = "rockMod:neonColor";

  private static readonly _windowTintMeta = "rockMod:windowTint";

  private static readonly _wheelTypeMeta = "rockMod:wheelType";

  private readonly _vimpVehicle: VimpVehicle;

  private readonly _onDestroy: (vehicle: VIMPVehicle) => void;

  private readonly _mods = new Map<number, number>();

  private _customPrimaryColor = new RGBA(0, 0, 0);

  private _customSecondaryColor = new RGBA(0, 0, 0);

  public override get id(): number {
    return this._vimpVehicle.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public override get isExists(): boolean {
    return this._vimpVehicle.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpVehicle.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpVehicle.dimension;
  }

  public override get model(): number {
    return this._vimpVehicle.model;
  }

  public override get rotation(): IVector3D {
    const r = this._vimpVehicle.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

  public get bodyHealth(): number {
    return this._vimpVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._vimpVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return (this._vimpVehicle as VimpVehicleWithNumberPlate).numberPlate;
  }

  public get isLocked(): boolean {
    const lockState = this._vimpVehicle.lockState;
    return lockState !== 0 && lockState !== 1;
  }

  public get isDead(): boolean {
    return !this.isExists || this.bodyHealth <= 0;
  }

  public get primaryColor(): number {
    return this._vimpVehicle.primaryColor;
  }

  public get secondaryColor(): number {
    return this._vimpVehicle.secondaryColor;
  }

  public get customPrimaryColor(): IRGBA {
    return this._customPrimaryColor;
  }

  public get customSecondaryColor(): IRGBA {
    return this._customSecondaryColor;
  }

  public get driver(): VIMPPlayer | null {
    const vimpDriver = this._vimpVehicle.driver;
    if (!vimpDriver) return null;
    return RockMod.instance.players.findByID(vimpDriver.id) as VIMPPlayer | null;
  }

  public get passengers(): Set<VIMPPlayer> {
    const passengers = new Set<VIMPPlayer>();
    for (const vimpPassenger of this._vimpVehicle.passengers) {
      const player = RockMod.instance.players.findByID(vimpPassenger.id) as VIMPPlayer | null;
      if (player) {
        passengers.add(player);
      }
    }
    return passengers;
  }

  protected override get vimpMeta(): VimpVehicle {
    return this._vimpVehicle;
  }

  public constructor(options: IVIMPVehicleOptions) {
    super();
    this._vimpVehicle = options.vimpVehicle;
    this._onDestroy = options.onDestroy;
    this._restoreCompatibilityState();
  }

  public override destroy(): void {
    if (!this._vimpVehicle.isExists) return;
    this._vimpVehicle.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpVehicle.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._vimpVehicle.dimension = value;
  }

  public override setModel(value: string): void {
    this._vimpVehicle.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    this._vimpVehicle.rotation = { x: value.x, y: value.y, z: value.z };
  }

  public setBodyHealth(value: number): void {
    this._vimpVehicle.bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    this._vimpVehicle.engineHealth = value;
  }

  public setEngineOn(value: boolean): void {
    this._vimpVehicle.engineOn = value;
  }

  public setNumberPlate(value: string): void {
    (this._vimpVehicle as VimpVehicleWithNumberPlate).numberPlate = value;
  }

  public setLocked(value: boolean): void {
    this._vimpVehicle.lockState = value ? 2 : 1;
  }

  public setPrimaryColor(value: number): void {
    this._vimpVehicle.primaryColor = value;
  }

  public setSecondaryColor(value: number): void {
    this._vimpVehicle.secondaryColor = value;
  }

  public setCustomPrimaryColor(value: IRGBA): void {
    this._customPrimaryColor = this._toRgba(value);
    this._setCompatibilityMeta(VIMPVehicle._customPrimaryColorMeta, this._customPrimaryColor);
  }

  public setCustomSecondaryColor(value: IRGBA): void {
    this._customSecondaryColor = this._toRgba(value);
    this._setCompatibilityMeta(VIMPVehicle._customSecondaryColorMeta, this._customSecondaryColor);
  }

  public setMod(modType: number, modIndex: number): void {
    this._mods.set(Math.trunc(modType), Math.trunc(modIndex));
    this._setCompatibilityMeta(VIMPVehicle._vehicleModsMeta, Object.fromEntries(this._mods));
  }

  public getMod(modType: number): number {
    return this._mods.get(Math.trunc(modType)) ?? -1;
  }

  public setNeonEnabled(enabled: boolean): void {
    this._setCompatibilityMeta(VIMPVehicle._neonEnabledMeta, enabled);
  }

  public setNeonColor(r: number, g: number, b: number): void {
    this._setCompatibilityMeta(VIMPVehicle._neonColorMeta, new RGBA(r, g, b));
  }

  public setWindowTint(tintType: number): void {
    this._setCompatibilityMeta(VIMPVehicle._windowTintMeta, Math.trunc(tintType));
  }

  public setWheelType(wheelType: number): void {
    this._setCompatibilityMeta(VIMPVehicle._wheelTypeMeta, Math.trunc(wheelType));
  }

  public setPlateType(plateType: number): void {
    this._vimpVehicle.numberPlateType = plateType;
  }

  public explode(): void {
    this._vimpVehicle.bodyHealth = 0;
    this._vimpVehicle.engineHealth = -4000;
    this._vimpVehicle.engineOn = false;
  }

  public repair(): void {
    this._vimpVehicle.bodyHealth = 1000;
    this._vimpVehicle.engineHealth = 1000;
  }

  private _restoreCompatibilityState(): void {
    this._customPrimaryColor = this._readColorMeta(VIMPVehicle._customPrimaryColorMeta);
    this._customSecondaryColor = this._readColorMeta(VIMPVehicle._customSecondaryColorMeta);

    const mods = this._vimpVehicle.getStreamSyncedMeta<Record<string, unknown>>(VIMPVehicle._vehicleModsMeta);
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
    const value = this._vimpVehicle.getStreamSyncedMeta<Partial<IRGBA>>(key);
    if (!value || typeof value !== "object") {
      return new RGBA(0, 0, 0);
    }

    return new RGBA(Number(value.r) || 0, Number(value.g) || 0, Number(value.b) || 0, value.a);
  }

  private _setCompatibilityMeta(key: string, value: unknown): void {
    this._vimpVehicle.setStreamSyncedMeta(key, value);
  }

  private _toRgba(value: IRGBA): RGBA {
    return new RGBA(value.r, value.g, value.b, value.a);
  }
}
