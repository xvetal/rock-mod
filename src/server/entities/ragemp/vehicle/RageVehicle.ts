import { RageEntity } from "../entity/RageEntity";
import { IVehicle, IVehicleOptions } from "../../common/vehicle/IVehicle";

export class RageVehicle extends RageEntity implements IVehicle {
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
