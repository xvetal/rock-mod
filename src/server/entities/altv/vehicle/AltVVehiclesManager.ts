import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVVehicle } from "./AltVVehicle";
import { IVehiclesManager } from "../../common/vehicle/IVehiclesManager";

export class AltVVehiclesManager extends AltVEntitiesManager<AltVVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }
}
