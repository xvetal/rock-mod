import { IWorldObject, IWorldObjectOptions } from "../../common/worldObject/IWorldObject";
import { Vector3D } from "../../../common/utils/math/Vectors";
import { AltVBaseObject } from "../baseObject/AltVBaseObject";

export abstract class AltVWorldObject extends AltVBaseObject implements IWorldObject {
  private readonly _position: Vector3D;

  private readonly _dimension: number;

  public get position(): Vector3D {
    return this._position;
  }

  public get dimension(): number {
    return this._dimension;
  }

  protected constructor(options: IWorldObjectOptions) {
    super(options);
    this._position = options.position;
    this._dimension = options.dimension;
  }
}
