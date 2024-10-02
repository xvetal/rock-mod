import { IWorldObject } from "../../common/worldObject/IWorldObject";
import { IRageBaseObjectOptions, RageBaseObject } from "../baseObject/RageBaseObject";
import { Vector3D } from "../../../common/utils/math/Vectors";

export interface IRageWorldObjectOptions<T extends EntityMp> extends IRageBaseObjectOptions<T> {}

export abstract class RageWorldObject<T extends EntityMp> extends RageBaseObject<T> implements IWorldObject {
  public get position(): Vector3D {
    const { x, y, z } = this.mpEntity.position;

    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this.mpEntity.dimension;
  }

  protected constructor(options: IRageWorldObjectOptions<T>) {
    super(options);
  }

  public setPosition(value: Vector3D): void {
    this.mpEntity.position = new Vector3(value);
  }

  public setDimension(value: number): void {
    this.mpEntity.dimension = value;
  }
}
