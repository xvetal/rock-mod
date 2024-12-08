import { IVehicleCreateOptions, IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { MockEntitiesManager } from "../entity/MockEntitiesManager";
import { MockVehicle } from "./MockVehicle";
import { RockMod } from "../../../RockMod";
import { BaseObjectType } from "../../common";

export interface IMockVehicleCreateOptions extends IVehicleCreateOptions {}

export class MockVehiclesManager extends MockEntitiesManager<MockVehicle> implements IVehiclesManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: "vehicle",
    });

    this._nextId = 0;
  }

  public create(options: IMockVehicleCreateOptions): MockVehicle {
    const { model, engine, locked, position, dimension, rotation } = options;

    const vehicle = new MockVehicle({
      id: this._nextId++,
      type: BaseObjectType.Vehicle,
      model: RockMod.instance.utils.hash(model),
      engine,
      locked,
      position,
      dimension,
      rotation,
    });

    this.registerBaseObject(vehicle);

    return vehicle;
  }
}
