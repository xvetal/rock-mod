import { type IUiManager } from "../../common/ui/IUiManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxUiManager implements IUiManager {
  public getStreetNameFromHashKey(_hash: number): string {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getStreetNameFromHashKey");
  }

  public getLabelText(_labelName: string): string {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getLabelText");
  }

  public hideHudComponentThisFrame(_componentIndex: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.hideHudComponentThisFrame");
  }

  public displayRadar(_display: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.displayRadar");
  }

  public setPauseMenuActive(_toggle: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.setPauseMenuActive");
  }

  public setWaypoint(_x: number, _y: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.setWaypoint");
  }

  public deleteWaypoint(): void {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.deleteWaypoint");
  }

  public getBlipInfoIdCoord(_blip: number): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getBlipInfoIdCoord");
  }
}
