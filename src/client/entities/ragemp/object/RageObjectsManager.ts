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
      this.registerByRemoteId(mpObject.remoteId);
    }
  }

  public registerByRemoteId(remoteId: number): RageObject {
    const existingObject = this.findByRemoteID(remoteId);
    if (existingObject) {
      return existingObject;
    }

    const mpObject = mp.objects.atRemoteId(remoteId);

    mpObject.isExists = (): boolean => mp.objects.exists(mpObject);
    const object = new RageObject({
      mpEntity: mpObject,
    });
    this.registerBaseObject(object);

    return object;
  }
}
