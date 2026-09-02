/// <reference types="@vimp-mp/types/client" />

import { type IUiManager } from "../../common/ui/IUiManager";
import { type IVector3D, Vector3D } from "@shared/common/utils";

export class VIMPUiManager implements IUiManager {
  public getStreetNameFromHashKey(hash: number): string {
    return vimp.natives.hud.getStreetNameFromHashKey(hash);
  }

  public getLabelText(labelName: string): string {
    if (!vimp.natives.hud.doesTextLabelExist(labelName)) {
      return labelName;
    }

    const text = vimp.natives.hud.getFilenameForAudioConversation(labelName);
    return text && text !== "NULL" ? text : labelName;
  }

  public hideHudComponentThisFrame(componentIndex: number): void {
    vimp.natives.hud.hideHudComponentThisFrame(componentIndex);
  }

  public displayRadar(display: boolean): void {
    vimp.natives.hud.displayRadar(display);
  }

  public setPauseMenuActive(toggle: boolean): void {
    vimp.natives.hud.setPauseMenuActive(toggle);
  }

  public setWaypoint(x: number, y: number): void {
    vimp.natives.hud.setNewWaypoint(x, y);
  }

  public deleteWaypoint(): void {
    vimp.natives.hud.setWaypointOff();
  }

  public getBlipInfoIdCoord(blip: number): IVector3D {
    const { x, y, z } = vimp.natives.hud.getBlipInfoIdCoord(blip);
    return new Vector3D(x, y, z);
  }
}
