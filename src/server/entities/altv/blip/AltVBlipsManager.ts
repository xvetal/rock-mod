import { IBlipCreateOptions, IBlipsManager } from "../../common";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";
import { AltVBlip } from "./AltVBlip";
import PointBlip = AltVServer.PointBlip;
import Vector3 = AltVShared.Vector3;

export interface IAltVBlipCreateOptions extends IBlipCreateOptions {}

export class AltVBlipsManager extends AltVWorldObjectsManager<AltVBlip> implements IBlipsManager {
  public constructor() {
    super({
      baseObjectsType: "blip",
    });
  }

  public create(options: IAltVBlipCreateOptions): AltVBlip {
    const { sprite, position, dimension, alpha } = options;

    const mpEntity = new PointBlip(new Vector3(position), true);
    mpEntity.sprite = sprite;
    mpEntity.dimension = dimension;
    mpEntity.alpha = alpha;

    const blip = new AltVBlip({ mpEntity });
    this.registerBaseObject(blip);

    return blip;
  }
}
