import { IEntity } from "../../common/entity/IEntity";
import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";

export interface IRageEntityOptions<T extends EntityMp> extends IRageWorldObjectOptions<T> {}

export abstract class RageEntity<T extends EntityMp> extends RageWorldObject<T> implements IEntity {
  public get model(): number {
    return this.mpEntity.model;
  }

  protected constructor(options: IRageEntityOptions<T>) {
    super(options);
  }

  public setModel(value: number): void {
    this.mpEntity.model = value;
  }
}
