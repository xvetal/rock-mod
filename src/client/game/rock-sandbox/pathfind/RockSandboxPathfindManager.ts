import { type IPathfindManager, type IStreetNameHash } from "../../common/pathfind/IPathfindManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxPathfindManager implements IPathfindManager {
  public getStreetNameAtCoord(_position: IVector3D): IStreetNameHash {
    return rockSandboxNotImplemented("client", "RockSandboxPathfindManager.getStreetNameAtCoord");
  }
}
