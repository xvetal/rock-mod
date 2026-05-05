import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { type CCMPPed } from "./CCMPPed";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPPedCreateOptions extends IPedCreateOptions {}

export class CCMPPedsManager extends CCMPEntitiesManager<CCMPPed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(_options: ICCMPPedCreateOptions): CCMPPed {
    return notImplemented("CCMPPedsManager.create");
  }
}
