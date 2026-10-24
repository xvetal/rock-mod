import { type IUiManager } from "@RockMod/client/game";
import { type IRadarScreenBounds } from "../../common/ui/IUiManager";
import { gtaRadarScreenBounds } from "../../../internal/gtaRadarScreenBounds";
import { type IVector3D, Vector3D } from "@shared/common/utils";

export class RageUiManager implements IUiManager {
  public getRadarScreenBounds(): IRadarScreenBounds {
    const safezone = mp.game.graphics.getSafeZoneSize();
    const { x, y } = mp.game.graphics.getActiveScreenResolution();
    return gtaRadarScreenBounds(safezone, x, y);
  }

  public getStreetNameFromHashKey(hash: number): string {
    return mp.game.ui.getStreetNameFromHashKey(hash);
  }

  public getLabelText(labelName: string): string {
    return mp.game.ui.getLabelText(labelName);
  }

  public hideHudComponentThisFrame(componentIndex: number): void {
    mp.game.ui.hideHudComponentThisFrame(componentIndex);
  }

  public displayRadar(display: boolean): void {
    mp.game.ui.displayRadar(display);
  }

  public setPauseMenuActive(toggle: boolean): void {
    mp.game.ui.setPauseMenuActive(toggle);
  }

  public setWaypoint(x: number, y: number): void {
    mp.game.ui.setNewWaypoint(x, y);
  }

  public deleteWaypoint(): void {
    mp.game.ui.deleteWaypoint();
  }

  public getBlipInfoIdCoord(blip: number): IVector3D {
    const { x, y, z } = mp.game.ui.getBlipInfoIdCoord(blip);
    return new Vector3D(x, y, z);
  }
}
