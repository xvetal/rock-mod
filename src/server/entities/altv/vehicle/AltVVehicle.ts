import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import { IVehicle } from "../../common/vehicle/IVehicle";
import Vehicle = AltVServer.Vehicle;
import VehicleLockState = AltVShared.VehicleLockState;
import { RGBA } from "../../../common/utils";
import { AltVPlayer } from "../player/AltVPlayer";
import { RockMod } from "../../../RockMod";

export interface IAltVVehicleOptions extends IAltVEntityOptions<Vehicle> {}

export class AltVVehicle extends AltVEntity<Vehicle> implements IVehicle {
  public get bodyHealth(): number {
    return this.mpEntity.bodyHealth;
  }

  public get engineHealth(): number {
    return this.mpEntity.engineHealth;
  }

  public get numberPlate(): string {
    return this.mpEntity.numberPlateText;
  }

  public get isLocked(): boolean {
    return this.mpEntity.lockState > 1;
  }

  public get isDead(): boolean {
    return this.mpEntity.destroyed;
  }

  public get primaryColor(): number {
    return this.mpEntity.primaryColor;
  }

  public get secondaryColor(): number {
    return this.mpEntity.secondaryColor;
  }

  public get customPrimaryColor(): RGBA {
    const { r, g, b, a } = this.mpEntity.customPrimaryColor;
    return new RGBA(r, g, b, a);
  }

  public get customSecondaryColor(): RGBA {
    const { r, g, b, a } = this.mpEntity.customSecondaryColor;
    return new RGBA(r, g, b, a);
  }

  public get driver(): AltVPlayer | null {
    const mpPlayer = this.mpEntity.driver;

    if (!mpPlayer) {
      return null;
    }

    return RockMod.instance.players.getByID(mpPlayer.id) as AltVPlayer;
  }

  public get passengers(): Set<AltVPlayer> {
    const players: Set<AltVPlayer> = new Set();

    for (const mpPlayer of Object.values(this.mpEntity.passengers)) {
      const player = RockMod.instance.players.getByID(mpPlayer.id) as AltVPlayer;
      players.add(player);
    }

    return players;
  }

  public constructor(options: IAltVVehicleOptions) {
    super(options);
  }

  public setBodyHealth(value: number): void {
    this.mpEntity.bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    this.mpEntity.engineHealth = value;
  }

  public setNumberPlate(value: string): void {
    this.mpEntity.numberPlateText = value;
  }

  public setLocked(value: boolean): void {
    this.mpEntity.lockState = value ? VehicleLockState.Locked : VehicleLockState.Unlocked;
  }

  public setPrimaryColor(value: number): void {
    this.mpEntity.primaryColor = value;
  }

  public setSecondaryColor(value: number): void {
    this.mpEntity.secondaryColor = value;
  }

  public setCustomPrimaryColor(value: RGBA): void {
    const { r, g, b, a } = value;
    this.mpEntity.customPrimaryColor = new AltVShared.RGBA(r, g, b, a);
  }

  public setCustomSecondaryColor(value: RGBA): void {
    const { r, g, b, a } = value;
    this.mpEntity.customSecondaryColor = new AltVShared.RGBA(r, g, b, a);
  }

  public explode(): void {
    this.mpEntity.engineHealth = 0;
    this.mpEntity.bodyHealth = 0;
  }

  public repair(): void {
    return this.mpEntity.repair();
  }
}
