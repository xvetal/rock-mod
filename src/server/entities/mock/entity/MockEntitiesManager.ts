import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type MockEntity } from "./MockEntity";
import { type IMockWorldObjectsManagerOptions, MockWorldObjectsManager } from "../worldObject/MockWorldObjectsManager";

export interface IMockEntitiesManagerOptions extends IMockWorldObjectsManagerOptions {}

export abstract class MockEntitiesManager<T extends MockEntity>
  extends MockWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: IMockEntitiesManagerOptions) {
    super(options);
  }
}
