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
    const { model, position, rotation } = options;
    // CCMP peds API does not yet support `frozen` or `dimension` — both are silently ignored.

    const ccmpPed = ccmp.peds.create(ccmp.hash(model), position.x, position.y, position.z, rotation.z);
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
