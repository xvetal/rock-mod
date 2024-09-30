import { IWorldObject } from "../../common/worldObject/IWorldObject";
import { Vector3D } from "../../../common/utils/math/Vectors";
import { AltVBaseObject, IAltVBaseObjectOptions } from "../baseObject/AltVBaseObject";
import WorldObject = AltVServer.WorldObject;

export interface IAltVWorldObjectOptions<T extends WorldObject> extends IAltVBaseObjectOptions<T> {}

export abstract class AltVWorldObject<T extends WorldObject> extends AltVBaseObject<T> implements IWorldObject {
  public get position(): Vector3D {
    const { x, y, z } = this.mpEntity.pos;

    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this.mpEntity.dimension;
  }

  protected constructor(options: IAltVWorldObjectOptions<T>) {
    super(options);
  }
}
