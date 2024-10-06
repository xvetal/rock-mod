import { IPedCreateOptions, IPedsManager } from "../../common";
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

    const mpEntity = mp.peds.new(mp.joaat(model), new mp.Vector3(position), {
      dimension,
      heading: rotation.z,
    });
    mpEntity.isExists = (): boolean => mp.peds.exists(mpEntity);

    const ped = new RagePed({ mpEntity });
    this.registerBaseObject(ped);

    return ped;
  }
}
