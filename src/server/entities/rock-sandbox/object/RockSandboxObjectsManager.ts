import { type IObjectsManager, type IObjectCreateOptions } from "../../common/object/IObjectsManager";
import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { RockSandboxObjectsIterator } from "./RockSandboxObjectsIterator";
import { wrapObject } from "./RockSandboxObject";
export class RockSandboxObjectsManager extends RockSandboxEntitiesManager<IObject> implements IObjectsManager {
  private readonly _objectsIterator = new RockSandboxObjectsIterator();

  public override get iterator(): RockSandboxObjectsIterator {
    return this._objectsIterator;
  }

  public override findByID(id: number): IObject | null {
    const object = getRockSandbox().objects.getById(id);
    return object === null ? null : wrapObject(object);
  }

  public override getByID(id: number): IObject {
    const object = this.findByID(id);
    if (object === null)
      throw new Error(`[RockSandbox:server] RockSandboxObjectsManager.getByID: object ${id} not found`);
    return object;
  }

  public create(options: IObjectCreateOptions): IObject {
    if (options.placeOnGround === true)
      throw new Error("[RockSandbox:server] RockSandboxObjectsManager.create: placeOnGround is not supported");
    return wrapObject(
      getRockSandbox().objects.create({
        model: options.model,
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        rotation: { x: options.rotation.x, y: options.rotation.z, z: -options.rotation.y },
        dimension: options.dimension,
        alpha: options.alpha,
        collidable: options.collidable,
      }),
    );
  }
}
