import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type RageEntity } from "./RageEntity";
import { type IRageWorldObjectsManagerOptions, RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";

export interface IRageEntitiesManagerOptions extends IRageWorldObjectsManagerOptions {}

export abstract class RageEntitiesManager<T extends RageEntity<EntityMp>>
  extends RageWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  protected constructor(options: IRageEntitiesManagerOptions) {
    super(options);
  }

  public abstract syncWithMpPool(): void;
  public abstract registerByRemoteId(remoteId: number): T;

  public unregisterByRemoteId(remoteId: number): T {
    const existingObject = this.getByRemoteID(remoteId);

    this.unregisterBaseObject(existingObject);
    return existingObject;
  }
}
