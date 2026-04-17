import { type IGuiManager } from "@RockMod/client/game";

export class RageGuiManager implements IGuiManager {
  public takeScreenshot(name: string, type: number, quality: number, compressionQuality: number): void {
    mp.gui.takeScreenshot(name, type, quality, compressionQuality);
  }
}
