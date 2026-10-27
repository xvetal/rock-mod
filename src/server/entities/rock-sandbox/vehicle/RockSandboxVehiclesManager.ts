import { type IVehiclesManager, type IVehicleCreateOptions } from "../../common/vehicle/IVehiclesManager";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";

import { getRockSandbox } from "../../../internal/getRockSandbox";
import { nativeVehicleRotation } from "../../../../shared/internal/rockSandboxVehicleAxes";
import { wrapVehicle, type RockSandboxVehicle } from "./RockSandboxVehicle";
import { RockSandboxVehiclesIterator } from "./RockSandboxVehiclesIterator";
export class RockSandboxVehiclesManager extends RockSandboxEntitiesManager<IVehicle> implements IVehiclesManager {
  private readonly _vehiclesIterator = new RockSandboxVehiclesIterator();

  public override get iterator(): RockSandboxVehiclesIterator {
    return this._vehiclesIterator;
  }

  public override findByID(id: number): RockSandboxVehicle | null {
    const vehicle = getRockSandbox().vehicles.getById(id);
    return vehicle === null ? null : wrapVehicle(vehicle);
  }

  public override getByID(id: number): RockSandboxVehicle {
    const vehicle = this.findByID(id);
    if (vehicle === null)
      throw new Error("[RockSandbox:server] RockSandboxVehiclesManager.getByID: vehicle " + id + " not found");
    return vehicle;
  }

  public deleteById(id: number): RockSandboxVehicle {
    const vehicle = this.getByID(id);
    vehicle.destroy();
    return vehicle;
  }

  public create(options: IVehicleCreateOptions): IVehicle {
    if (options.numberPlateType !== undefined)
      throw new Error("[RockSandbox:server] RockSandboxVehiclesManager.create: numberPlateType is not supported");
    return wrapVehicle(
      getRockSandbox().vehicles.create({
        model: options.model,
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        rotation: nativeVehicleRotation(options.rotation),
        dimension: options.dimension,
        engineOn: options.engine,
        locked: options.locked,
        ...(options.numberPlate === undefined ? {} : { numberPlate: options.numberPlate }),
      }),
    );
  }
}
