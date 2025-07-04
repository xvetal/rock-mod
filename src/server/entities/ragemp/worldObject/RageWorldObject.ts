import { type IWorldObject } from "../../common/worldObject/IWorldObject";
import { type IRageBaseObjectOptions, RageBaseObject } from "../baseObject/RageBaseObject";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";

export interface IRageWorldObjectOptions<T extends EntityMp> extends IRageBaseObjectOptions<T> {
  position?: IVector3D;
}

export abstract class RageWorldObject<T extends EntityMp> extends RageBaseObject<T> implements IWorldObject {
  private _position?: IVector3D;

  public get position(): Vector3D {
    const { x, y, z } = this.mpEntity.position ?? this._position;

    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this.mpEntity.dimension;
  }

  protected constructor(options: IRageWorldObjectOptions<T>) {
    super(options);
    if (options.position) this._position = options.position;
  }

  public setPosition(value: Vector3D): void {
    if (this._position) this._position = value;
    this.mpEntity.position = new mp.Vector3(value);
  }

  public setDimension(value: number): void {
    this.mpEntity.dimension = value;
  }
}
