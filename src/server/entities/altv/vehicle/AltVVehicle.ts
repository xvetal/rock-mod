import { AltVEntity } from "../entity/AltVEntity";
import { IVehicle, IVehicleOptions } from "../../common/vehicle/IVehicle";

export class AltVVehicle extends AltVEntity implements IVehicle {
  private _bodyHealth: number;

  get bodyHealth() {
    return this._bodyHealth;
  }

  set bodyHealth(value: number) {
    this._bodyHealth = value;
  }

  constructor(options: IVehicleOptions) {
    super(options);
    this._bodyHealth = 100;
  }
}
