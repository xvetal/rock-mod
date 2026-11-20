/// <reference types="@vimp-mp/types/client" />

import { type IGameCameraManager } from "@RockMod/client/game";

export class VIMPGameCameraManager implements IGameCameraManager {
  public screenFadeIn(duration: number): void {
    vimp.natives.cam.doScreenFadeIn(duration);
  }

  public screenFadeOut(duration: number): void {
    vimp.natives.cam.doScreenFadeOut(duration);
  }
}
