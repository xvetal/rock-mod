/// <reference types="@classic-mp/types/client" />

import { type INametagsManager } from "../../common/nametags/INametagsManager";

export class CCMPNametagsManager implements INametagsManager {
  public setEnabled(enabled: boolean): void {
    ccmp.nametags.setEnabled(enabled);
  }
}
