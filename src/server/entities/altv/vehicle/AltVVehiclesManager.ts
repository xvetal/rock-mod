import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVVehicle } from "./AltVVehicle";
import { IVehicleCreateOptions, IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { IVehicle } from "../../common/vehicle/IVehicle";
import alt = AltVServer;

export interface IAltVVehicleCreateOptions extends IVehicleCreateOptions {}

export class AltVVehiclesManager extends AltVEntitiesManager<AltVVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }

  public create(options: IAltVVehicleCreateOptions): IVehicle {
    const { model, position, dimension, rotation, engine, locked } = options;

    const mpEntity = new alt.Vehicle(model, position, rotation);
    mpEntity.dimension = dimension;
    mpEntity.engineOn = engine;
    mpEntity.lockState = locked ? 2 : 1;

    const vehicle = new AltVVehicle({ mpEntity });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
