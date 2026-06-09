import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { CCMPObject, type ICCMPObjectNative } from "./CCMPObject";

export interface ICCMPObjectCreateOptions extends IObjectCreateOptions {}

export class CCMPObjectsManager extends CCMPEntitiesManager<CCMPObject> implements IObjectsManager {
  public constructor() {
    super({
      baseObjectsType: "object",
    });
  }

  public create(options: ICCMPObjectCreateOptions): CCMPObject {
    const { model, position, dimension, rotation, alpha } = options;
    const ccmpObject = ccmp.objects.create(
      ccmp.hash(model),
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      { dimension, alpha },
    ) as ICCMPObjectNative | null;

    if (!ccmpObject) {
      throw new Error("CCMPObjectsManager.create: ccmp.objects.create failed (server full?)");
    }

    const object = new CCMPObject({
      ccmpObject,
      alpha,
      onDestroy: (o): void => this.unregisterBaseObject(o),
    });
    this.registerBaseObject(object);

    return object;
  }
}
