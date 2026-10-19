import { type IVehiclesManager, type IVehicleCreateOptions } from "../../common/vehicle/IVehiclesManager";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxVehiclesManager extends RockSandboxEntitiesManager<IVehicle> implements IVehiclesManager {
  public create(_options: IVehicleCreateOptions): IVehicle {
    return rockSandboxNotImplemented("client", "RockSandboxVehiclesManager.create");
  }

  public getDisplayNameFromVehicleModel(_modelHash: number): string {
    return rockSandboxNotImplemented("client", "RockSandboxVehiclesManager.getDisplayNameFromVehicleModel");
  }
}
