import {
  type IRaycastingManager,
  type IRaycastResult,
  type TIgnoreEntityType,
} from "../../common/raycasting/IRaycastingManager";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxRaycastingManager implements IRaycastingManager {
  public testPointToPoint(
    startPos: IVector3D,
    endPos: IVector3D,
    ignoreEntity?: TIgnoreEntityType,
    flags?: number | number[],
  ): IRaycastResult | null {
    const ignored = Array.isArray(ignoreEntity) ? ignoreEntity.map((entity) => entity.handle) : ignoreEntity?.handle;
    const result = getRockSandbox().raycasting.testPointToPoint(
      { x: startPos.x, y: startPos.z, z: -startPos.y },
      { x: endPos.x, y: endPos.z, z: -endPos.y },
      ignored,
      flags,
    );
    if (result === null) return null;
    return {
      entityHandle: result.entityHandle,
      position: new Vector3D(result.position.x, -result.position.z, result.position.y),
      surfaceNormal: new Vector3D(result.surfaceNormal.x, -result.surfaceNormal.z, result.surfaceNormal.y),
    };
  }
}
