import { type IGameplayManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class RageGameplayManager implements IGameplayManager {
  public setFadeOutAfterDeath(toggle: boolean): void {
    mp.game.gameplay.setFadeOutAfterDeath(toggle);
  }

  public getGroundZFor3dCoord(position: IVector3D, ignoreWater: boolean, waterLevelCheck: boolean): number {
    return mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, ignoreWater, waterLevelCheck);
  }
}
