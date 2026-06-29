import { type IBlipCreateOptions, type IBlipsManager } from "../../common";
import { RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";
import { RageBlip } from "./RageBlip";

export interface IRageBlipCreateOptions extends IBlipCreateOptions {}

export class RageBlipsManager extends RageWorldObjectsManager<RageBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(options: IRageBlipCreateOptions): RageBlip {
    const { sprite, position, global = false, ...createOptions } = options;

    const mpEntity = mp.blips.new(sprite, new mp.Vector3(position), createOptions);
    mpEntity.isExists = (): boolean => mp.blips.exists(mpEntity);

    const blip = new RageBlip({
      mpEntity: mpEntity as unknown as EntityMp,
      global,
    });
    this.registerBaseObject(blip);

    return blip;
  }
}
