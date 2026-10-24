import { type IGameCameraManager } from "../../common/camera/IGameCameraManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxGameCameraManager implements IGameCameraManager {
  public screenFadeIn(duration: number): void {
    getRockSandbox().screen.fadeIn(duration);
  }

  public screenFadeOut(duration: number): void {
    getRockSandbox().screen.fadeOut(duration);
  }
}
