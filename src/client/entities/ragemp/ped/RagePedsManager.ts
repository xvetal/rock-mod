import { type IPedCreateOptions, type IPedsManager } from "../../common";
import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePed } from "./RagePed";

export interface IRagePedCreateOptions extends IPedCreateOptions {}

export class RagePedsManager extends RageEntitiesManager<RagePed> implements IPedsManager {
  public constructor() {
    super({
      baseObjectsType: "ped",
    });
  }

  public create(options: IRagePedCreateOptions): RagePed {
    const { model, position, dimension, rotation } = options;

    const mpEntity = mp.peds.new(mp.game.joaat(model), new mp.Vector3(position), rotation.z, dimension);
    mpEntity.isExists = (): boolean => mp.peds.exists(mpEntity);

    const ped = new RagePed({ mpEntity });
    this.registerBaseObject(ped);

    return ped;
  }

  public syncWithMpPool(): void {
    for (const mpPed of mp.peds.toArray()) {
      this.registerByRemoteId(mpPed.remoteId);
    }
  }

  public registerByRemoteId(remoteId: number): RagePed {
    const existingPed = this.findByRemoteID(remoteId);
    if (existingPed) {
      return existingPed;
    }

    const mpPed = mp.peds.atRemoteId(remoteId);

    mpPed.isExists = (): boolean => mp.peds.exists(mpPed);
    const ped = new RagePed({
      mpEntity: mpPed,
    });
    this.registerBaseObject(ped);

    return ped;
  }
}
