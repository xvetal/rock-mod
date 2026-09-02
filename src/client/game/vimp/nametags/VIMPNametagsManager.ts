/// <reference types="@vimp-mp/types/client" />

import { type INametagsManager } from "../../common/nametags/INametagsManager";

export class VIMPNametagsManager implements INametagsManager {
  public setEnabled(enabled: boolean): void {
    vimp.nametags.setEnabled(enabled);
  }
}
