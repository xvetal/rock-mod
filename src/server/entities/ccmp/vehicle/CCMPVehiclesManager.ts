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
    const { model, position, rotation, engine, dimension, locked } = options;
    const createOptions: {
      dimension: number;
      engineOn: boolean;
      lockState: number;
      numberPlate?: string;
      numberPlateType?: number;
    } = {
      dimension,
      engineOn: engine,
      lockState: locked ? 2 : 1,
    };

    if (options.numberPlate !== undefined) createOptions.numberPlate = options.numberPlate;
    if (options.numberPlateType !== undefined) createOptions.numberPlateType = options.numberPlateType;

    const ccmpVehicle = ccmp.vehicles.create(
      ccmp.hash(model),
      position.x,
      position.y,
      position.z,
      rotation.z,
      createOptions,
    );
    if (!ccmpVehicle) {
      throw new Error("CCMPVehiclesManager.create: ccmp.vehicles.create failed (server full?)");
    }

    const vehicle = new CCMPVehicle({
      ccmpVehicle,
      onDestroy: (v): void => this.unregisterBaseObject(v),
    });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
