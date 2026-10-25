import { type IVehiclesManager, type IVehicleCreateOptions } from "../../common/vehicle/IVehiclesManager";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

import { getRockSandbox } from "../../../internal/getRockSandbox";
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
      throw new Error("[RockSandbox:client] RockSandboxVehiclesManager.getByID: vehicle " + id + " not found");
    return vehicle;
  }

  public override deleteById(id: number): RockSandboxVehicle {
    const vehicle = this.getByID(id);
    vehicle.destroy();
    return vehicle;
  }

  public override findByRemoteID(id: number): RockSandboxVehicle | null {
    return this.findByID(id);
  }

  public override getByRemoteID(id: number): RockSandboxVehicle {
    return this.getByID(id);
  }

  public create(_options: IVehicleCreateOptions): IVehicle {
    return rockSandboxNotImplemented("client", "RockSandboxVehiclesManager.create");
  }

  public getDisplayNameFromVehicleModel(_modelHash: number): string {
    return getRockSandbox().vehicles.getModelName(_modelHash);
  }
}
