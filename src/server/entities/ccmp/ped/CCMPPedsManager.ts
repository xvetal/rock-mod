import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { CCMPPed } from "./CCMPPed";

export interface ICCMPPedCreateOptions extends IPedCreateOptions {}

export class CCMPPedsManager extends CCMPEntitiesManager<CCMPPed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(options: ICCMPPedCreateOptions): CCMPPed {
    const { model, frozen, invincible = false, position, rotation, dimension } = options;

    const ccmpPed = ccmp.peds.create(ccmp.hash(model), position.x, position.y, position.z, rotation.z, {
      dimension,
      frozen,
      invincible,
    });
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
