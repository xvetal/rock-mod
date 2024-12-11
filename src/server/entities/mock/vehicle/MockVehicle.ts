import { IVehicle } from "../../common/vehicle/IVehicle";
import { MockEntity, IMockEntityOptions } from "../entity/MockEntity";
import { IRGBA, RGBA } from "../../../../shared/common/utils";
import { MockPlayer } from "../player/MockPlayer";

export interface IMockVehicleOptions extends IMockEntityOptions {
  engine?: boolean;
  locked?: boolean;
}

export class MockVehicle extends MockEntity implements IVehicle {
  private _bodyHealth: number;

  private _engineHealth: number;

  private _numberPlate: string;

  private _isLocked: boolean;

  private _isDead: boolean;

  private _primaryColor: number;

  private _secondaryColor: number;

  private _customPrimaryColor: IRGBA;

  private _customSecondaryColor: IRGBA;

  private _passengers: Set<MockPlayer>;

  public get bodyHealth(): number {
    return this._bodyHealth;
  }

  public get engineHealth(): number {
    return this._engineHealth;
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
  }

  public setBodyHealth(value: number): void {
    this._bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    this._engineHealth = Math.clamp(value, 0, 1000);
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

  public explode(): void {
    this.setBodyHealth(0);
    this.setEngineHealth(0);
  }

  public repair(): void {
    this.setBodyHealth(1000);
    this.setEngineHealth(1000);
  }
}
