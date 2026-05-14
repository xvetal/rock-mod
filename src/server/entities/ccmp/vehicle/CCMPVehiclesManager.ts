import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { CCMPVehicle } from "./CCMPVehicle";

export interface ICCMPVehicleCreateOptions extends IVehicleCreateOptions {}

export class CCMPVehiclesManager extends CCMPEntitiesManager<CCMPVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }

  public create(options: ICCMPVehicleCreateOptions): CCMPVehicle {
    const { model, position, rotation, engine } = options;
    // CCMP vehicles API has no `locked` field or per-vehicle `dimension` yet — both are silently ignored.

    const ccmpVehicle = ccmp.vehicles.create(ccmp.hash(model), position.x, position.y, position.z, rotation.z);
    if (!ccmpVehicle) {
      throw new Error("CCMPVehiclesManager.create: ccmp.vehicles.create failed (server full?)");
    }

    if (engine) {
      ccmpVehicle.engineOn = true;
    }

    const vehicle = new CCMPVehicle({
      ccmpVehicle,
      onDestroy: (v): void => this.unregisterBaseObject(v),
    });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
