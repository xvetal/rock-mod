import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RageVehicle } from "./RageVehicle";
import { IVehicleCreateOptions, IVehiclesManager } from "../../common/vehicle/IVehiclesManager";

export interface IRageVehicleCreateOptions extends IVehicleCreateOptions {}

export class RageVehiclesManager extends RageEntitiesManager<RageVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }

  public create(options: IRageVehicleCreateOptions): RageVehicle {
    const { model, position, dimension, rotation, engine, locked } = options;

    const mpEntity = mp.vehicles.new(model, new mp.Vector3(position), {
      dimension,
      heading: rotation.z,
      engine,
      locked,
    });
    mpEntity.rotation = new mp.Vector3(rotation);
    mpEntity.isExists = (): boolean => mp.vehicles.exists(mpEntity);

    const vehicle = new RageVehicle({ mpEntity });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
