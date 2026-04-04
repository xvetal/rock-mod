import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type IObject } from "@RockMod/client/entities";

export interface IRageObjectOptions extends IRageEntityOptions<ObjectMp> {}

export class RageObject extends RageEntity<ObjectMp> implements IObject {
  public constructor(options: IRageObjectOptions) {
    super(options);
  }
}
