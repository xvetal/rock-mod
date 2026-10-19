import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type IEntity } from "../../common/entity/IEntity";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEntitiesManager<T extends IEntity>
  extends RockSandboxWorldObjectsManager<T>
  implements IEntitiesManager<T>
{
  public syncWithMpPool(): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntitiesManager.syncWithMpPool");
  }

  public registerById(_id: number): T {
    return rockSandboxNotImplemented("client", "RockSandboxEntitiesManager.registerById");
  }

  public unregisterById(_id: number): T {
    return rockSandboxNotImplemented("client", "RockSandboxEntitiesManager.unregisterById");
  }
}
