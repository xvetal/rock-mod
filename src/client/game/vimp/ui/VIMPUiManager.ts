/// <reference types="@classic-mp/types/client" />

import { type IUiManager } from "../../common/ui/IUiManager";
import { type IVector3D, Vector3D } from "@shared/common/utils";

export class CCMPUiManager implements IUiManager {
  public getStreetNameFromHashKey(hash: number): string {
    return ccmp.natives.hud.getStreetNameFromHashKey(hash);
  }

  public getLabelText(labelName: string): string {
    if (!ccmp.natives.hud.doesTextLabelExist(labelName)) {
      return labelName;
    }

    const text = ccmp.natives.hud.getFilenameForAudioConversation(labelName);
    return text && text !== "NULL" ? text : labelName;
  }

  public hideHudComponentThisFrame(componentIndex: number): void {
    ccmp.natives.hud.hideHudComponentThisFrame(componentIndex);
  }

  public displayRadar(display: boolean): void {
    ccmp.natives.hud.displayRadar(display);
  }

  public setPauseMenuActive(toggle: boolean): void {
    ccmp.natives.hud.setPauseMenuActive(toggle);
  }

  public setWaypoint(x: number, y: number): void {
    ccmp.natives.hud.setNewWaypoint(x, y);
  }

  public deleteWaypoint(): void {
    ccmp.natives.hud.setWaypointOff();
  }

  public getBlipInfoIdCoord(blip: number): IVector3D {
    const { x, y, z } = ccmp.natives.hud.getBlipInfoIdCoord(blip);
    return new Vector3D(x, y, z);
  }
}
