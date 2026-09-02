import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import type { PedExtras } from "@vimp-mp/types/server";
import { VIMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { VIMPPed } from "./VIMPPed";

export interface IVIMPPedCreateOptions extends IPedCreateOptions {}

export class VIMPPedsManager extends VIMPEntitiesManager<VIMPPed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(options: IVIMPPedCreateOptions): VIMPPed {
    const { model, frozen, invincible = false, placeOnGround, position, rotation, dimension } = options;

    const extras: PedExtras = {
      dimension,
      frozen,
      invincible,
    };
    if (placeOnGround !== undefined) {
      extras.placeOnGround = placeOnGround;
    }

    const vimpPed = vimp.peds.create(vimp.hash(model), position.x, position.y, position.z, rotation.z, extras);
    if (!vimpPed) {
      throw new Error("VIMPPedsManager.create: vimp.peds.create failed (server full?)");
    }

    const ped = new VIMPPed({
      vimpPed,
      onDestroy: (p): void => this.unregisterBaseObject(p),
    });
    this.registerBaseObject(ped);

    return ped;
  }
}
