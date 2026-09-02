import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { VIMPWorldObjectsManager } from "../worldObject/VIMPWorldObjectsManager";
import { VIMPBlip } from "./VIMPBlip";

export interface IVIMPBlipCreateOptions extends IBlipCreateOptions {}

export class VIMPBlipsManager extends VIMPWorldObjectsManager<VIMPBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(options: IVIMPBlipCreateOptions): VIMPBlip {
    const {
      position,
      dimension,
      sprite,
      color = 0,
      scale = 1,
      alpha = 255,
      drawDistance = 0,
      global = false,
      name = "",
      shortRange = false,
    } = options;

    const createOptions: {
      name: string;
      alpha: number;
      drawDistance: number;
      global: boolean;
      shortRange: boolean;
      dimension?: number;
      rotation?: number;
    } = {
      name,
      alpha,
      drawDistance,
      global,
      shortRange,
      dimension,
    };

    if (options.rotation !== undefined) {
      createOptions.rotation = options.rotation;
    }

    const vimpBlip = vimp.blips.create(sprite, position.x, position.y, position.z, color, scale, createOptions);
    if (!vimpBlip) {
      throw new Error("VIMPBlipsManager.create: vimp.blips.create failed (server full?)");
    }

    const blip = new VIMPBlip({
      vimpBlip,
      onDestroy: (b): void => this.unregisterBaseObject(b),
    });
    this.registerBaseObject(blip);

    return blip;
  }
}
