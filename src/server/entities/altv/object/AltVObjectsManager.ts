import { IObjectCreateOptions, IObjectsManager } from "../../common/object/IObjectsManager";
import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVObject } from "./AltVObject";
import alt = AltVServer;

export interface IAltVObjectCreateOptions extends IObjectCreateOptions {}

export class AltVObjectsManager extends AltVEntitiesManager<AltVObject> implements IObjectsManager {
  public constructor() {
    super({
      baseObjectsType: "object",
    });
  }

  public create(options: IAltVObjectCreateOptions): AltVObject {
    const { model, position, dimension, rotation, alpha } = options;

    const mpEntity = new alt.Object(model, position, rotation, alpha);
    mpEntity.dimension = dimension;

    const object = new AltVObject({ mpEntity });
    this.registerBaseObject(object);

    return object;
  }
}
