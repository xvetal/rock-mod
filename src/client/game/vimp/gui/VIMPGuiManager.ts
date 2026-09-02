/// <reference types="@vimp-mp/types/client" />

import { type IGuiManager } from "../../common/gui/IGuiManager";

export class VIMPGuiManager implements IGuiManager {
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
    console.warn("[VIMPGuiManager] takeScreenshot is not available in VIMP client JS.");
  }
}
