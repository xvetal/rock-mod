import { IEntity } from "../../common/entity/IEntity";
import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { Vector3D } from "../../../common/utils";

export interface IRageEntityOptions<T extends EntityMp> extends IRageWorldObjectOptions<T> {}

export abstract class RageEntity<T extends EntityMp> extends RageWorldObject<T> implements IEntity {
  public get model(): number {
    return this.mpEntity.model;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this.mpEntity.rotation;
    return new Vector3D(x, y, z);
  }

  protected constructor(options: IRageEntityOptions<T>) {
    super(options);
  }

  public setModel(value: string): void {
    this.mpEntity.model = mp.joaat(value);
  }

  public setRotation(value: Vector3D): void {
    this.mpEntity.rotation = new mp.Vector3(value);
  }
}
