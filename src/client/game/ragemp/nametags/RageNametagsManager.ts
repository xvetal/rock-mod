import { type INametagsManager } from "@RockMod/client/game";

export class RageNametagsManager implements INametagsManager {
  public setEnabled(enabled: boolean): void {
    mp.nametags.enabled = enabled;
  }
}
