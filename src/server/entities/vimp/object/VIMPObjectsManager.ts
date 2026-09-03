import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import type { ObjectCreateOptions } from "@vimp-mp/types/server";
import { VIMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { VIMPObject, type IVIMPObjectNative } from "./VIMPObject";

export interface IVIMPObjectCreateOptions extends IObjectCreateOptions {}

export class VIMPObjectsManager extends VIMPEntitiesManager<VIMPObject> implements IObjectsManager {
  public constructor() {
    super({
      baseObjectsType: "object",
    });
  }

  public create(options: IVIMPObjectCreateOptions): VIMPObject {
    const { model, position, dimension, rotation, alpha, placeOnGround } = options;

    const extras: ObjectCreateOptions = { dimension, alpha };
    if (placeOnGround !== undefined) {
      extras.placeOnGround = placeOnGround;
    }

    const vimpObject = vimp.objects.create(
      vimp.hash(model),
      position.x,
      position.y,
      position.z,
      rotation.x,
      rotation.y,
      rotation.z,
      extras,
    ) as IVIMPObjectNative | null;

    if (!vimpObject) {
      throw new Error("VIMPObjectsManager.create: vimp.objects.create failed (server full?)");
    }

    const object = new VIMPObject({
      vimpObject,
      alpha,
      onDestroy: (o): void => this.unregisterBaseObject(o),
    });
    this.registerBaseObject(object);

    return object;
  }
}
