import { type IGameCameraManager } from "@RockMod/client/game";

export class RageGameCameraManager implements IGameCameraManager {
  public screenFadeIn(duration: number): void {
    mp.game.cam.doScreenFadeIn(duration);
  }

  public screenFadeOut(duration: number): void {
    mp.game.cam.doScreenFadeOut(duration);
  }
}
