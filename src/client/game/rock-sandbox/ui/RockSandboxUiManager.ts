import { type IUiManager } from "../../common/ui/IUiManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxUiManager implements IUiManager {
  public getStreetNameFromHashKey(_hash: number): string {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getStreetNameFromHashKey");
  }

  public getLabelText(_labelName: string): string {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getLabelText");
  }

  public hideHudComponentThisFrame(componentIndex: number): void {
    getRockSandbox().hud.hideComponentThisFrame(componentIndex);
  }

  public displayRadar(display: boolean): void {
    getRockSandbox().hud.setRadarVisible(display);
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
