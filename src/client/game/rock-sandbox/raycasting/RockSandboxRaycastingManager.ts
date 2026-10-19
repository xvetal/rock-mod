import {
  type IRaycastingManager,
  type IRaycastResult,
  type TIgnoreEntityType,
} from "../../common/raycasting/IRaycastingManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxRaycastingManager implements IRaycastingManager {
  public testPointToPoint(
    _startPos: IVector3D,
    _endPos: IVector3D,
    _ignoreEntity?: TIgnoreEntityType,
    _flags?: number | number[],
  ): IRaycastResult | null {
    return rockSandboxNotImplemented("client", "RockSandboxRaycastingManager.testPointToPoint");
  }
}
