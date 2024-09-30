import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVVehicle } from "./AltVVehicle";
import { IVehicleCreateOptions, IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { AltVNetManager } from "../../../net/altv/AltVNetManager";
import { IVehicle } from "../../common/vehicle/IVehicle";
import alt = AltVServer;

export interface IAltVVehicleCreateOptions extends IVehicleCreateOptions {}

export class AltVVehiclesManager extends AltVEntitiesManager<AltVVehicle> implements IVehiclesManager {
  public constructor(net: AltVNetManager) {
    super({
      baseObjectsType: "vehicle",
      net,
    });
  }

  public create(options: IAltVVehicleCreateOptions): IVehicle {
    const { model, position, rotation } = options;

    const mpEntity = new alt.Vehicle(model, position.x, position.y, position.z, rotation.x, rotation.y, rotation.z);

    const vehicle = new AltVVehicle({ mpEntity });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
