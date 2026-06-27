import { type IPedCreateOptions, type IPedsManager } from "../../common";
import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVPed } from "./AltVPed";
import alt = AltVServer;

export interface IAltVPedCreateOptions extends IPedCreateOptions {}

export class AltVPedsManager extends AltVEntitiesManager<AltVPed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(options: IAltVPedCreateOptions): AltVPed {
    const { model, frozen, invincible = false, position, dimension, rotation } = options;

    const mpEntity = new alt.Ped(model, position, rotation);
    mpEntity.dimension = dimension;
    mpEntity.frozen = frozen;
    (mpEntity as alt.Ped & { invincible: boolean }).invincible = invincible;

    const ped = new AltVPed({ mpEntity });
    this.registerBaseObject(ped);

    return ped;
  }
}
