import { type IObjectsManager, type IObjectCreateOptions } from "../../common/object/IObjectsManager";
import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxObjectsManager extends RockSandboxEntitiesManager<IObject> implements IObjectsManager {
  public create(_options: IObjectCreateOptions): IObject {
    return rockSandboxNotImplemented("server", "RockSandboxObjectsManager.create");
  }
}
