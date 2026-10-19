import { type ICameraManager, type ICameraCreateOptions } from "../../common/camera/ICameraManager";
import { type ICamera } from "../../common/camera/ICamera";
import { RockSandboxBaseObjectsManager } from "../baseObject/RockSandboxBaseObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxCameraManager extends RockSandboxBaseObjectsManager<ICamera> implements ICameraManager {
  public create(_options: ICameraCreateOptions): ICamera {
    return rockSandboxNotImplemented("client", "RockSandboxCameraManager.create");
  }

  public renderScriptCams(_render: boolean, _ease: boolean, _easeTime: number, _freezePreviousCamera: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxCameraManager.renderScriptCams");
  }

  public getGameplayCamera(): ICamera {
    return rockSandboxNotImplemented("client", "RockSandboxCameraManager.getGameplayCamera");
  }
}
