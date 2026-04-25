import { type IZoneManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class RageZoneManager implements IZoneManager {
  public getNameOfZone(position: IVector3D): string {
    return mp.game.zone.getNameOfZone(position.x, position.y, position.z);
  }
}
