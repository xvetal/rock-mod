import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RageVehicle } from "./RageVehicle";
import { IVehicleCreateOptions, IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { RageNetManager } from "../../../net/ragemp/RageNetManager";

export interface IRageVehicleCreateOptions extends IVehicleCreateOptions {}

export class RageVehiclesManager extends RageEntitiesManager<RageVehicle> implements IVehiclesManager {
  public constructor(net: RageNetManager) {
    super({
      baseObjectsType: "vehicle",
      net,
    });
  }

  public create(options: IRageVehicleCreateOptions): RageVehicle {
    const { model, position } = options;

    const mpEntity = mp.vehicles.new(model, new mp.Vector3(position));
    const vehicle = new RageVehicle({ mpEntity });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
