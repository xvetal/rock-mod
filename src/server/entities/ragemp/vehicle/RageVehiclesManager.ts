import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RageVehicle } from "./RageVehicle";
import { IVehiclesManager } from "../../common/vehicle/IVehiclesManager";

export class RageVehiclesManager extends RageEntitiesManager<RageVehicle> implements IVehiclesManager {
  constructor() {
    super({
      entitiesType: "vehicle",
    });
  }
}
