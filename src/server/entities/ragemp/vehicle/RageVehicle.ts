import { RageEntity } from "../entity/RageEntity";
import { IVehicle, IVehicleOptions } from "../../common/vehicle/IVehicle";

export class RageVehicle extends RageEntity implements IVehicle {
  private _bodyHealth: number;

  public get bodyHealth(): number {
    return this._bodyHealth;
  }

  public set bodyHealth(value: number) {
    this._bodyHealth = value;
  }

  public constructor(options: IVehicleOptions) {
    super(options);
    this._bodyHealth = 100;
  }
}
