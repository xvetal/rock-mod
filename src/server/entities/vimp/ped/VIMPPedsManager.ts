import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import type { PedExtras } from "@classic-mp/types/server";
import { CCMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { CCMPPed } from "./VIMPPed";

export interface ICCMPPedCreateOptions extends IPedCreateOptions {}

export class CCMPPedsManager extends CCMPEntitiesManager<CCMPPed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(options: ICCMPPedCreateOptions): CCMPPed {
    const { model, frozen, invincible = false, placeOnGround, position, rotation, dimension } = options;

    const extras: PedExtras = {
      dimension,
      frozen,
      invincible,
    };
    if (placeOnGround !== undefined) {
      extras.placeOnGround = placeOnGround;
    }

    const ccmpPed = ccmp.peds.create(ccmp.hash(model), position.x, position.y, position.z, rotation.z, extras);
    if (!ccmpPed) {
      throw new Error("CCMPPedsManager.create: ccmp.peds.create failed (server full?)");
    }

    const ped = new CCMPPed({
      ccmpPed,
      onDestroy: (p): void => this.unregisterBaseObject(p),
    });
    this.registerBaseObject(ped);

    return ped;
  }
}
