import { IBlipCreateOptions, IBlipsManager } from "../../common";
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
    const { sprite, position } = options;

    const mpEntity = mp.blips.new(sprite, new mp.Vector3(position), options);
    mpEntity.isExists = (): boolean => mp.blips.exists(mpEntity);

    const blip = new RageBlip({
      mpEntity: mpEntity as unknown as EntityMp,
    });
    this.registerBaseObject(blip);

    return blip;
  }
}
