import { type IEntitiesManager } from "../../common/entity/IEntitiesManager";
import { type IEntity } from "../../common/entity/IEntity";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";

export class RockSandboxEntitiesManager<T extends IEntity>
  extends RockSandboxWorldObjectsManager<T>
  implements IEntitiesManager<T> {}
