import { type IObjectsManager, type IObjectCreateOptions } from "../../common/object/IObjectsManager";
import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { type RockSandboxObject, wrapObject } from "./RockSandboxObject";
import { RockSandboxObjectsIterator } from "./RockSandboxObjectsIterator";

export class RockSandboxObjectsManager extends RockSandboxEntitiesManager<IObject> implements IObjectsManager {
  private readonly _objectsIterator = new RockSandboxObjectsIterator();
  public override get iterator(): RockSandboxObjectsIterator {
    return this._objectsIterator;
  }
  public override findByID(id: number): RockSandboxObject | null {
    const object = getRockSandbox().objects.getById(id);
    return object === null ? null : wrapObject(object);
  }
  public override getByID(id: number): RockSandboxObject {
    const object = this.findByID(id);
    if (!object) throw new Error(`[RockSandbox:client] RockSandboxObjectsManager.getByID: object ${id} not found`);
    return object;
  }
  public override findByRemoteID(id: number): RockSandboxObject | null {
    return this.findByID(id);
  }
  public override getByRemoteID(id: number): RockSandboxObject {
    return this.getByID(id);
  }
  public create(_options: IObjectCreateOptions): IObject {
    return rockSandboxNotImplemented("client", "RockSandboxObjectsManager.create");
  }
}
