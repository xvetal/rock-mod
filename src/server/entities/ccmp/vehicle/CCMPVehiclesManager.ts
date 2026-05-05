import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { type CCMPVehicle } from "./CCMPVehicle";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPVehicleCreateOptions extends IVehicleCreateOptions {}

export class CCMPVehiclesManager extends CCMPEntitiesManager<CCMPVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }

  public create(_options: ICCMPVehicleCreateOptions): CCMPVehicle {
    return notImplemented("CCMPVehiclesManager.create");
  }
}
