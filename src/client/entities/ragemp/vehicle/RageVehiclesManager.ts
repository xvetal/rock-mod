import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RageVehicle } from "./RageVehicle";
import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";

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

  public syncWithMpPool(): void {
    for (const mpVehicle of mp.vehicles.toArray()) {
      this.registerById(mpVehicle.id);
    }
  }

  public registerById(id: number): RageVehicle {
    const existingVehicle = this.findByID(id);
    if (existingVehicle) {
      return existingVehicle;
    }

    const mpVehicle = mp.vehicles.at(id);

    mpVehicle.isExists = (): boolean => mp.vehicles.exists(mpVehicle);
    const vehicle = new RageVehicle({
      mpEntity: mpVehicle,
    });
    this.registerBaseObject(vehicle);

    return vehicle;
  }

  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return mp.game.vehicle.getDisplayNameFromVehicleModel(modelHash);
  }
}
