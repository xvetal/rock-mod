import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { type CCMPBlip } from "./CCMPBlip";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPBlipCreateOptions extends IBlipCreateOptions {}

export class CCMPBlipsManager extends CCMPWorldObjectsManager<CCMPBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(_options: ICCMPBlipCreateOptions): CCMPBlip {
    return notImplemented("CCMPBlipsManager.create");
  }
}
