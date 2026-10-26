import { type IGameplayManager } from "../../common/gameplay/IGameplayManager";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { RockSandboxRaycastingManager } from "../raycasting/RockSandboxRaycastingManager";

export class RockSandboxGameplayManager implements IGameplayManager {
  public setFadeOutAfterDeath(_toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxGameplayManager.setFadeOutAfterDeath");
  }

  public getGroundZFor3dCoord(position: IVector3D, _ignoreWater: boolean, waterLevelCheck: boolean): number {
    if (waterLevelCheck)
      throw new Error(
        "[RockSandbox:client] RockSandboxGameplayManager.getGroundZFor3dCoord: water level queries are not supported",
      );
    if (![position.x, position.y, position.z].every(Number.isFinite))
      throw new Error("[RockSandbox:client] RockSandboxGameplayManager.getGroundZFor3dCoord: invalid position");
    // Collision surfaces only. Native physics has no separate water-height source.
    // Exclude actors and vehicles, and keep misses/errors visible to the caller.
    const hit = new RockSandboxRaycastingManager().testPointToPoint(
      new Vector3D(position.x, position.y, position.z + 1),
      new Vector3D(position.x, position.y, position.z - 1000),
      null,
      1 | 16,
    );
    if (hit === null)
      throw new Error("[RockSandbox:client] RockSandboxGameplayManager.getGroundZFor3dCoord: no ground surface found");
    return hit.position.z;
  }
}
