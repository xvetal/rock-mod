import { type IGameCameraManager } from "../../common/camera/IGameCameraManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGameCameraManager implements IGameCameraManager {
  public screenFadeIn(_duration: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxGameCameraManager.screenFadeIn");
  }

  public screenFadeOut(_duration: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxGameCameraManager.screenFadeOut");
  }
}
