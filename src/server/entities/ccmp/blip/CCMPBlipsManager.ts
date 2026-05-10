import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { CCMPBlip } from "./CCMPBlip";

export interface ICCMPBlipCreateOptions extends IBlipCreateOptions {}

export class CCMPBlipsManager extends CCMPWorldObjectsManager<CCMPBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(options: ICCMPBlipCreateOptions): CCMPBlip {
    const {
      position,
      dimension,
      sprite,
      color = 0,
      scale = 1,
      alpha = 255,
      drawDistance = 0,
      name = "",
      rotation = 0,
      shortRange = false,
    } = options;

    const ccmpBlip = ccmp.blips.create(sprite, position.x, position.y, position.z, color, scale, {
      name,
      alpha,
      drawDistance,
      shortRange,
      rotation,
      dimension,
    });
    if (!ccmpBlip) {
      throw new Error("CCMPBlipsManager.create: ccmp.blips.create failed (server full?)");
    }

    const blip = new CCMPBlip({
      ccmpBlip,
      onDestroy: (b): void => this.unregisterBaseObject(b),
    });
    this.registerBaseObject(blip);

    return blip;
  }
}
