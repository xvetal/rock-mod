/// <reference types="@classic-mp/types/client" />

import { type IGuiManager } from "../../common/gui/IGuiManager";

export class CCMPGuiManager implements IGuiManager {
  private _warnedTakeScreenshot = false;

  public takeScreenshot(name: string, type: number, quality: number, compressionQuality: number): void {
    void name;
    void type;
    void quality;
    void compressionQuality;

    if (this._warnedTakeScreenshot) {
      return;
    }

    this._warnedTakeScreenshot = true;
    console.warn("[CCMPGuiManager] takeScreenshot is not available in CCMP client JS.");
  }
}
