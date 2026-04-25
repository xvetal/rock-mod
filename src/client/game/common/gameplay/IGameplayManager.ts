import { type IVector3D } from "@shared/common/utils";

export interface IGameplayManager {
  setFadeOutAfterDeath(toggle: boolean): void;
  getGroundZFor3dCoord(position: IVector3D, ignoreWater: boolean, waterLevelCheck: boolean): number;
}
