import { IEntity } from "../../common/entity/IEntity";
import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import hash = AltVShared.hash;
import Entity = AltVServer.Entity;
import { Vector3D } from "../../../common/utils";
import Vector3 = AltVShared.Vector3;

export interface IAltVEntityOptions<T extends Entity> extends IAltVWorldObjectOptions<T> {}

export abstract class AltVEntity<T extends Entity> extends AltVWorldObject<T> implements IEntity {
  public get model(): number {
    return this.mpEntity.model;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this.mpEntity.rot;
    return new Vector3D(x, y, z);
  }

  protected constructor(options: IAltVEntityOptions<T>) {
    super(options);
  }

  public setModel(value: string): void {
    this.mpEntity.model = hash(value);
  }

  public setRotation(value: Vector3D): void {
    this.mpEntity.rot = new Vector3(value);
  }
}
