import { AltVEntity } from "../entity/AltVEntity";
import { IVehicle, IVehicleOptions } from "../../common/vehicle/IVehicle";

export class AltVVehicle extends AltVEntity implements IVehicle {
  private _bodyHealth: number;

  public get bodyHealth(): number {
    return this._bodyHealth;
  }

  public constructor(options: IVehicleOptions) {
    super(options);
    this._bodyHealth = 100;
  }

  public setBodyHealth(value: number): void {
    this._bodyHealth = value;
  }
}
