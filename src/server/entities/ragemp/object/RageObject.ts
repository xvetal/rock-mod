import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { IObject } from "../../common/object/IObject";

export interface IRageObjectOptions extends IRageEntityOptions<ObjectMp> {}

export class RageObject extends RageEntity<ObjectMp> implements IObject {
  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public constructor(options: IRageObjectOptions) {
    super(options);
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }
}
