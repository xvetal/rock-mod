import { type IWorldObjectsManager } from "../../common/worldObject/IWorldObjectsManager";
import { type MockWorldObject } from "./MockWorldObject";
import { type IMockBaseObjectsManagerOptions, MockBaseObjectsManager } from "../baseObject/MockBaseObjectsManager";
import { MockWorldObjectsIterator } from "./MockWorldObjectsIterator";

export interface IMockWorldObjectsManagerOptions extends IMockBaseObjectsManagerOptions {}

export abstract class MockWorldObjectsManager<T extends MockWorldObject>
  extends MockBaseObjectsManager<T>
  implements IWorldObjectsManager<T>
{
  protected override readonly _iterator: MockWorldObjectsIterator<T>;

  protected constructor(options: IMockWorldObjectsManagerOptions) {
    super(options);
    this._iterator = new MockWorldObjectsIterator(this.baseObjects);
  }

  public override get iterator(): MockWorldObjectsIterator<T> {
    return this._iterator;
  }
}
