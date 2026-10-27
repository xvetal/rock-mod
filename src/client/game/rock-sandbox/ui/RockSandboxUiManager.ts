import { type IUiManager, type IRadarScreenBounds } from "../../common/ui/IUiManager";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxUiManager implements IUiManager {
  public getRadarScreenBounds(): IRadarScreenBounds | null {
    return getRockSandbox().hud.getRadarScreenBounds();
  }

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

  public setPauseMenuActive(toggle: boolean): void {
    getRockSandbox().ui.setPauseMenuEnabled(toggle);
  }

  public setWaypoint(x: number, y: number): void {
    getRockSandbox().map.setWaypoint(x, -y);
  }

  public deleteWaypoint(): void {
    getRockSandbox().map.clearWaypoint();
  }

  public getWaypointCoords(): IVector3D | null {
    const point = getRockSandbox().map.getWaypoint();
    return point === null ? null : new Vector3D(point.x, -point.z, point.y);
  }

  public getBlipInfoIdCoord(_blip: number): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxUiManager.getBlipInfoIdCoord");
  }
}
