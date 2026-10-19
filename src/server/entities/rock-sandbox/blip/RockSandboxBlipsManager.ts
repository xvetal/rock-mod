import { type IBlipsManager, type IBlipCreateOptions } from "../../common/blip/IBlipsManager";
import { type IBlip } from "../../common/blip/IBlip";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBlipsManager extends RockSandboxWorldObjectsManager<IBlip> implements IBlipsManager {
  public create(_options: IBlipCreateOptions): IBlip {
    return rockSandboxNotImplemented("server", "RockSandboxBlipsManager.create");
  }
}
