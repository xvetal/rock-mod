import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import { IVehicle } from "../../common/vehicle/IVehicle";
import Vehicle = AltVServer.Vehicle;

export interface IAltVVehicleOptions extends IAltVEntityOptions<Vehicle> {}

export class AltVVehicle extends AltVEntity<Vehicle> implements IVehicle {
  public get bodyHealth(): number {
    return this.mpEntity.bodyHealth;
  }

  public constructor(options: IAltVVehicleOptions) {
    super(options);
  }

  public setBodyHealth(value: number): void {
    this.mpEntity.bodyHealth = value;
  }
}
