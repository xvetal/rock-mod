/// <reference types="@vimp-mp/types/client" />

import { type IGameplayManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class VIMPGameplayManager implements IGameplayManager {
  public setFadeOutAfterDeath(toggle: boolean): void {
    vimp.natives.misc.setFadeOutAfterDeath(toggle);
  }

  public getGroundZFor3dCoord(position: IVector3D, ignoreWater: boolean, waterLevelCheck: boolean): number {
    const result = vimp.natives.misc.getGroundZFor3dCoord(
      position.x,
      position.y,
      position.z,
      ignoreWater,
      waterLevelCheck,
    );

    return result.groundz;
  }
}
