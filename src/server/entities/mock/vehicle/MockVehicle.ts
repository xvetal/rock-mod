import { type IVehicle } from "../../common/vehicle/IVehicle";
import { MockEntity, type IMockEntityOptions } from "../entity/MockEntity";
import { type IRGBA, RGBA } from "../../../../shared/common/utils";
import { type MockPlayer } from "../player/MockPlayer";
import { MathClamp } from "../../../../shared/common/utils/math/Math";

export interface IMockVehicleOptions extends IMockEntityOptions {
  engine?: boolean;
  locked?: boolean;
}

export class MockVehicle extends MockEntity implements IVehicle {
  private _bodyHealth: number;

  private _engineHealth: number;

  private _engineOn: boolean;

  private _numberPlate: string;

  private _isLocked: boolean;

  private _isDead: boolean;

  private _primaryColor: number;

  private _secondaryColor: number;

  private _customPrimaryColor: IRGBA;

  private _customSecondaryColor: IRGBA;

  private _passengers: Set<MockPlayer>;

  private _mods: Map<number, number>;

  private _neonEnabled: boolean;

  private _neonColor: { r: number; g: number; b: number };

  private _windowTint: number;

  private _wheelType: number;

  private _plateType: number;

  public get bodyHealth(): number {
    return this._bodyHealth;
  }

  public get engineHealth(): number {
    return this._engineHealth;
  }

  public get engineOn(): boolean {
    return this._engineOn;
  }

  public get numberPlate(): string {
    return this._numberPlate;
  }

  public get isLocked(): boolean {
    return this._isLocked;
  }

  public get isDead(): boolean {
    return this._isDead;
  }

  public get primaryColor(): number {
    return this._primaryColor;
  }

  public get secondaryColor(): number {
    return this._secondaryColor;
  }

  public get customPrimaryColor(): RGBA {
    const { r, g, b, a = 255 } = this._customPrimaryColor;

    return new RGBA(r, g, b, a);
  }

  public get customSecondaryColor(): RGBA {
    const { r, g, b, a } = this._customSecondaryColor;

    return new RGBA(r, g, b, a);
  }

  public get neonEnabled(): boolean {
    return this._neonEnabled;
  }

  public get neonColor(): { r: number; g: number; b: number } {
    return this._neonColor;
  }

  public get windowTint(): number {
    return this._windowTint;
  }

  public get wheelType(): number {
    return this._wheelType;
  }

  public get plateType(): number {
    return this._plateType;
  }

  public get driver(): MockPlayer | null {
    for (const passenger of this._passengers.values()) {
      if (passenger.seat === 0) {
        return passenger;
      }
    }

    return null;
  }

  public get passengers(): Set<MockPlayer> {
    return this._passengers;
  }

  public constructor(options: IMockVehicleOptions) {
    super(options);

    this._engineOn = options.engine ?? false;
    this._bodyHealth = 1000;
    this._engineHealth = 1000;
    this._numberPlate = "";
    this._isLocked = options.locked ?? false;
    this._isDead = false;
    this._primaryColor = 0;
    this._secondaryColor = 0;
    this._customPrimaryColor = new RGBA(0, 0, 0);
    this._customSecondaryColor = new RGBA(0, 0, 0);
    this._passengers = new Set();
    this._mods = new Map();
    this._neonEnabled = false;
    this._neonColor = { r: 0, g: 0, b: 0 };
    this._windowTint = 0;
    this._wheelType = 0;
    this._plateType = 0;
  }

  public setBodyHealth(value: number): void {
    this._bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    this._engineHealth = MathClamp(value, 0, 1000);
  }

  public setEngineOn(value: boolean): void {
    this._engineOn = value;
  }

  public setNumberPlate(value: string): void {
    this._numberPlate = value;
  }

  public setLocked(value: boolean): void {
    this._isLocked = value;
  }

  public setPrimaryColor(value: number): void {
    this._primaryColor = value;
  }

  public setSecondaryColor(value: number): void {
    this._secondaryColor = value;
  }

  public setCustomPrimaryColor(value: RGBA): void {
    this._customPrimaryColor = value;
  }

  public setCustomSecondaryColor(value: RGBA): void {
    this._customSecondaryColor = value;
  }

  public setMod(modType: number, modIndex: number): void {
    this._mods.set(modType, modIndex);
  }

  public getMod(modType: number): number {
    return this._mods.get(modType) ?? -1;
  }

  public setNeonEnabled(enabled: boolean): void {
    this._neonEnabled = enabled;
  }

  public setNeonColor(r: number, g: number, b: number): void {
    this._neonColor = { r, g, b };
  }

  public setWindowTint(tintType: number): void {
    this._windowTint = tintType;
  }

  public setWheelType(wheelType: number): void {
    this._wheelType = wheelType;
  }

  public setPlateType(plateType: number): void {
    this._plateType = plateType;
  }

  public explode(): void {
    this.setBodyHealth(0);
    this.setEngineHealth(0);
  }

  public repair(): void {
    this.setBodyHealth(1000);
    this.setEngineHealth(1000);
  }
}
