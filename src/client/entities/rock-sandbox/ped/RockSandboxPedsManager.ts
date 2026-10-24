import { type IPedsManager, type IPedCreateOptions } from "../../common/ped/IPedsManager";
import { type IPed } from "../../common/ped/IPed";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
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
    const ped = getRockSandbox().peds.getByRemoteId(id);
    return ped === null ? null : wrapPed(ped);
  }

  public override getByRemoteID(id: number): RockSandboxPed {
    const ped = this.findByRemoteID(id);
    if (ped === null) throw new Error(`[RockSandbox:client] RockSandboxPedsManager.getByRemoteID: ped ${id} not found`);
    return ped;
  }

  public create(options: IPedCreateOptions): IPed {
    return wrapPed(
      getRockSandbox().peds.create({
        model: options.model,
        position: { x: options.position.x, y: options.position.z, z: -options.position.y },
        rotation: { x: options.rotation.x, y: options.rotation.z, z: -options.rotation.y },
        dimension: options.dimension,
      }),
    );
  }

  public override deleteById(id: number): RockSandboxPed {
    const ped = this.getByID(id);
    ped.destroy();
    return ped;
  }
}
