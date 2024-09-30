import { IEntitiesManager } from "../entity/IEntitiesManager";
import { IVehicle } from "./IVehicle";
import { Vector3D } from "../../../common/utils/math/Vectors";

export interface IVehicleCreateOptions {
  model: string;
  position: Vector3D;
  rotation: Vector3D;
}

export interface IVehiclesManager extends IEntitiesManager<IVehicle> {
  create(options: IVehicleCreateOptions): IVehicle;
}
