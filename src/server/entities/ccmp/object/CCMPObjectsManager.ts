import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { type CCMPObject } from "./CCMPObject";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPObjectCreateOptions extends IObjectCreateOptions {}

export class CCMPObjectsManager extends CCMPEntitiesManager<CCMPObject> implements IObjectsManager {
  public constructor() {
    super({
      baseObjectsType: "object",
    });
  }

  public create(_options: ICCMPObjectCreateOptions): CCMPObject {
    return notImplemented("CCMPObjectsManager.create");
  }
}
