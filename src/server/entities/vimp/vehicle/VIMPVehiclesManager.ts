import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { VIMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { VIMPVehicle } from "./VIMPVehicle";

export interface IVIMPVehicleCreateOptions extends IVehicleCreateOptions {}

export class VIMPVehiclesManager extends VIMPEntitiesManager<VIMPVehicle> implements IVehiclesManager {
  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });
  }

  public create(options: IVIMPVehicleCreateOptions): VIMPVehicle {
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

    const vimpVehicle = vimp.vehicles.create(
      vimp.hash(model),
      position.x,
      position.y,
      position.z,
      rotation.z,
      createOptions,
    );
    if (!vimpVehicle) {
      throw new Error("VIMPVehiclesManager.create: vimp.vehicles.create failed (server full?)");
    }

    const vehicle = new VIMPVehicle({
      vimpVehicle,
      onDestroy: (v): void => this.unregisterBaseObject(v),
    });
    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
