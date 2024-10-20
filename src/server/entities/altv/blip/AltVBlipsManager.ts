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
    const { alpha, color, dimension, name, position, rotation, scale, shortRange, sprite } = options;

    const mpEntity = new PointBlip(new Vector3(position), true);
    mpEntity.alpha = alpha ?? 255;
    mpEntity.color = color ?? 1;
    mpEntity.dimension = dimension;
    mpEntity.name = name ?? "";
    mpEntity.heading = rotation ?? 0;
    mpEntity.scale = scale ?? 1;
    mpEntity.shortRange = shortRange ?? false;
    mpEntity.sprite = sprite;

    const blip = new AltVBlip({ mpEntity });
    this.registerBaseObject(blip);

    return blip;
  }
}
