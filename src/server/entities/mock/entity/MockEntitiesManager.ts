import { IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { MockEntity } from "./MockEntity";
import { IMockWorldObjectsManagerOptions, MockWorldObjectsManager } from "../worldObject/MockWorldObjectsManager";

export interface IMockEntitiesManagerOptions extends IMockWorldObjectsManagerOptions {}

export abstract class MockEntitiesManager<T extends MockEntity>
  extends MockWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: IMockEntitiesManagerOptions) {
    super(options);
  }
}
