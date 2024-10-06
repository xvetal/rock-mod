import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IPed } from "../../common";

export interface IRagePedOptions extends IRageEntityOptions<PedMp> {}

export class RagePed extends RageEntity<PedMp> implements IPed {
  public constructor(options: IRagePedOptions) {
    super(options);
  }
}
