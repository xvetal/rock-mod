import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IVehicle } from "../../common/vehicle/IVehicle";

export interface IRageVehicleOptions extends IRageEntityOptions<VehicleMp> {}

export class RageVehicle extends RageEntity<VehicleMp> implements IVehicle {
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
}
