import { IPedCreateOptions, IPedsManager } from "../../common/ped/IPedsManager";
import { MockEntitiesManager } from "../entity/MockEntitiesManager";
import { MockPed } from "./MockPed";
import { RockMod } from "../../../RockMod";
import { BaseObjectType } from "../../common";

export interface IMockPedCreateOptions extends IPedCreateOptions {}

export class MockPedsManager extends MockEntitiesManager<MockPed> implements IPedsManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: "ped",
    });
    this._nextId = 0;
  }

  public create(options: IMockPedCreateOptions): MockPed {
    const { model, position, dimension, rotation } = options;

    const ped = new MockPed({
      id: this._nextId++,
      type: BaseObjectType.Ped,
      model: RockMod.instance.utils.hash(model),
      position,
      dimension,
      rotation,
    });

    this.registerBaseObject(ped);

    return ped;
  }
}
