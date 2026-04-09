import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RageObject } from "./RageObject";

export interface IRageObjectCreateOptions extends IObjectCreateOptions {}

export class RageObjectsManager extends RageEntitiesManager<RageObject> implements IObjectsManager {
  public constructor() {
    super({
      baseObjectsType: "object",
    });
  }

  public create(options: IRageObjectCreateOptions): RageObject {
    const { model, position, dimension, rotation, alpha } = options;

    const mpEntity = mp.objects.new(model, new mp.Vector3(position), {
      dimension,
      rotation: new mp.Vector3(rotation),
      alpha,
    });
    mpEntity.isExists = (): boolean => mp.objects.exists(mpEntity);

    const object = new RageObject({ mpEntity });
    this.registerBaseObject(object);

    return object;
  }

  public syncWithMpPool(): void {
    for (const mpObject of mp.objects.toArray()) {
      this.registerFromMp(mpObject);
    }
  }

  public registerFromMp(mpObject: ObjectMp): RageObject {
    const existingObject = this.findByID(mpObject.id);
    if (existingObject) {
      return existingObject;
    }

    mpObject.isExists = (): boolean => mp.objects.exists(mpObject);
    const object = new RageObject({
      mpEntity: mpObject,
    });
    this.registerBaseObject(object);

    return object;
  }

  public unregisterFromMp(mpObject: ObjectMp): RageObject | null {
    const object = this.findByID(mpObject.id);
    if (!object) {
      return null;
    }

    this.unregisterBaseObject(object);
    return object;
  }
}
