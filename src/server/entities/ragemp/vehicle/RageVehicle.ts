import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IVehicle } from "../../common/vehicle/IVehicle";

export interface IRageVehicleOptions extends IRageEntityOptions<VehicleMp> {}

export class RageVehicle extends RageEntity<VehicleMp> implements IVehicle {
  public get bodyHealth(): number {
    return this.mpEntity.bodyHealth;
  }

  public constructor(options: IRageVehicleOptions) {
    super(options);
  }

  public setBodyHealth(value: number): void {
    this.mpEntity.bodyHealth = value;
  }
}
