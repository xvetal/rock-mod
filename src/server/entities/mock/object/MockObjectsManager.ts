import { IObjectCreateOptions, IObjectsManager } from "../../common/object/IObjectsManager";
import { MockEntitiesManager } from "../entity/MockEntitiesManager";
import { MockObject } from "./MockObject";
import { RockMod } from "../../../RockMod";
import { BaseObjectType } from "../../../../shared";

export interface IMockObjectCreateOptions extends IObjectCreateOptions {}

export class MockObjectsManager extends MockEntitiesManager<MockObject> implements IObjectsManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: "object",
    });
    this._nextId = 0;
  }

  public create(options: IMockObjectCreateOptions): MockObject {
    const { model, alpha, position, dimension, rotation } = options;

    const object = new MockObject({
      id: this._nextId++,
      type: BaseObjectType.Object,
      model: RockMod.instance.utils.hash(model),
      alpha,
      position,
      dimension,
      rotation,
    });

    this.registerBaseObject(object);

    return object;
  }
}
