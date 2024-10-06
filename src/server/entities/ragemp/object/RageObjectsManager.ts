import { IObjectCreateOptions, IObjectsManager } from "../../common/object/IObjectsManager";
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
}
