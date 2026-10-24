import { type IPedsManager, type IPedCreateOptions } from "../../common/ped/IPedsManager";
import { type IPed } from "../../common/ped/IPed";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { RockSandboxPedsIterator } from "./RockSandboxPedsIterator";
import { type RockSandboxPed, wrapPed } from "./RockSandboxPed";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxPedsManager extends RockSandboxEntitiesManager<IPed> implements IPedsManager {
  private readonly _pedsIterator = new RockSandboxPedsIterator();

  public override get iterator(): RockSandboxPedsIterator {
    return this._pedsIterator;
  }

  public override findByID(id: number): RockSandboxPed | null {
    const ped = getRockSandbox().peds.getById(id);
    return ped === null ? null : wrapPed(ped);
  }

  public override getByID(id: number): RockSandboxPed {
    const ped = this.findByID(id);
    if (ped === null) throw new Error(`[RockSandbox:client] RockSandboxPedsManager.getByID: ped ${id} not found`);
    return ped;
  }

  public override findByRemoteID(id: number): RockSandboxPed | null {
    return this.findByID(id);
  }

  public override getByRemoteID(id: number): RockSandboxPed {
    return this.getByID(id);
  }

  public create(_options: IPedCreateOptions): IPed {
    return rockSandboxNotImplemented("client", "RockSandboxPedsManager.create");
  }
}
