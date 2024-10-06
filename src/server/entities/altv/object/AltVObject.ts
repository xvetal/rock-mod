import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import { IObject } from "../../common/object/IObject";

export interface IAltVObjectOptions extends IAltVEntityOptions<AltVServer.Object> {}

export class AltVObject extends AltVEntity<AltVServer.Object> implements IObject {
  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public constructor(options: IAltVObjectOptions) {
    super(options);
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }
}
