import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IVehicle } from "../../common/vehicle/IVehicle";
import { RGBA } from "../../../common/utils";
import { RagePlayer } from "../player/RagePlayer";
import { RockMod } from "../../../RockMod";

export interface IRageVehicleOptions extends IRageEntityOptions<VehicleMp> {}

export class RageVehicle extends RageEntity<VehicleMp> implements IVehicle {
  public get bodyHealth(): number {
    return this.mpEntity.bodyHealth;
  }

  public get engineHealth(): number {
    return this.mpEntity.engineHealth;
  }

  public get numberPlate(): string {
    return this.mpEntity.numberPlate;
  }

  public get isLocked(): boolean {
    return this.mpEntity.locked;
  }

  public get isDead(): boolean {
    return this.mpEntity.dead;
  }

  public get primaryColor(): number {
    return this.mpEntity.getColor(0);
  }

  public get secondaryColor(): number {
    return this.mpEntity.getColor(1);
  }

  public get customPrimaryColor(): RGBA {
    const [r, g, b] = this.mpEntity.getColorRGB(0);
    return new RGBA(r, g, b);
  }

  public get customSecondaryColor(): RGBA {
    const [r, g, b] = this.mpEntity.getColorRGB(1);
    return new RGBA(r, g, b);
  }

  public get driver(): RagePlayer | null {
    const mpPlayer = this.mpEntity.getOccupant(0);

    if (!mpPlayer) {
      return null;
    }

    return RockMod.instance.players.getByID(mpPlayer.id) as RagePlayer;
  }

  public get passengers(): Set<RagePlayer> {
    const players: Set<RagePlayer> = new Set();

    for (const mpPlayer of this.mpEntity.getOccupants()) {
      const player = RockMod.instance.players.getByID(mpPlayer.id) as RagePlayer;
      players.add(player);
    }

    return players;
  }

  public constructor(options: IRageVehicleOptions) {
    super(options);
  }

  public setBodyHealth(value: number): void {
    this.mpEntity.bodyHealth = value;
  }

  public setEngineHealth(value: number): void {
    throw new Error(`Not implemented (setEngineHealth: ${value})`);
  }

  public setNumberPlate(value: string): void {
    this.mpEntity.numberPlate = value;
  }

  public setLocked(value: boolean): void {
    this.mpEntity.locked = value;
  }

  public setPrimaryColor(value: number): void {
    return this.mpEntity.setColor(value, this.secondaryColor);
  }

  public setSecondaryColor(value: number): void {
    return this.mpEntity.setColor(this.primaryColor, value);
  }

  public setCustomPrimaryColor(value: RGBA): void {
    this.mpEntity.setColorRGB(
      value.r,
      value.g,
      value.b,
      this.customSecondaryColor.r,
      this.customSecondaryColor.g,
      this.customSecondaryColor.b,
    );
  }

  public setCustomSecondaryColor(value: RGBA): void {
    this.mpEntity.setColorRGB(
      this.customPrimaryColor.r,
      this.customPrimaryColor.g,
      this.customPrimaryColor.b,
      value.r,
      value.g,
      value.b,
    );
  }

  public explode(): void {
    return this.mpEntity.explode();
  }

  public repair(): void {
    return this.mpEntity.repair();
  }
}
