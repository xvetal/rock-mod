import { RageEntity } from "../entity/RageEntity";
import { IVehicle, IVehicleOptions } from "../../common/vehicle/IVehicle";

export class RageVehicle extends RageEntity implements IVehicle {
  private _bodyHealth: number;

  get bodyHealth() {
    return this._bodyHealth;
  }

  set bodyHealth(health: number) {
    this._bodyHealth = health;
  }

  constructor(options: IVehicleOptions) {
    super(options);
    this._bodyHealth = 100;
  }
}
