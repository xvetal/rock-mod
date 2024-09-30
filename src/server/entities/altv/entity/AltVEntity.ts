import { IEntity } from "../../common/entity/IEntity";
import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import Entity = AltVServer.Entity;

export interface IAltVEntityOptions<T extends Entity> extends IAltVWorldObjectOptions<T> {}

export abstract class AltVEntity<T extends Entity> extends AltVWorldObject<T> implements IEntity {
  public get model(): number {
    return this.mpEntity.model;
  }

  protected constructor(options: IAltVEntityOptions<T>) {
    super(options);
  }

  public setModel(value: number): void {
    this.mpEntity.model = value;
  }
}
