import { type IPathfindManager, type IStreetNameHash } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class RagePathfindManager implements IPathfindManager {
  public getStreetNameAtCoord(position: IVector3D): IStreetNameHash {
    return mp.game.pathfind.getStreetNameAtCoord(position.x, position.y, position.z);
  }
}
