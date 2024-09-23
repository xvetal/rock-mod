import { IEntitiesManager, IEntitiesManagerOptions } from "../../common/entity/IEntitiesManager";
import { RageEntity } from "./RageEntity";
import { RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";

export abstract class RageEntitiesManager<T extends RageEntity>
  extends RageWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: IEntitiesManagerOptions) {
    super(options);
  }
}
