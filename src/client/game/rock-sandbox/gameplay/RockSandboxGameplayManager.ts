import { type IGameplayManager } from "../../common/gameplay/IGameplayManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGameplayManager implements IGameplayManager {
  public setFadeOutAfterDeath(_toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxGameplayManager.setFadeOutAfterDeath");
  }

  public getGroundZFor3dCoord(_position: IVector3D, _ignoreWater: boolean, _waterLevelCheck: boolean): number {
    return rockSandboxNotImplemented("client", "RockSandboxGameplayManager.getGroundZFor3dCoord");
  }
}
