import { type IPedsManager, type IPedCreateOptions } from "../../common/ped/IPedsManager";
import { type IPed } from "../../common/ped/IPed";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxPedsManager extends RockSandboxEntitiesManager<IPed> implements IPedsManager {
  public create(_options: IPedCreateOptions): IPed {
    return rockSandboxNotImplemented("client", "RockSandboxPedsManager.create");
  }
}
