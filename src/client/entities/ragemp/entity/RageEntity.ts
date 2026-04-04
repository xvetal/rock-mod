import { type IEntity } from "../../common/entity/IEntity";
import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { Vector3D } from "../../../../shared/common/utils";

export interface IRageEntityOptions<T extends EntityMp> extends IRageWorldObjectOptions<T> {}

export abstract class RageEntity<T extends EntityMp> extends RageWorldObject<T> implements IEntity {
  public get remoteId(): number {
    return this.mpEntity.remoteId;
  }

  public get handle(): number {
    return this.mpEntity.handle;
  }

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

  public get heading(): number {
    return this.mpEntity.getHeading();
  }

  public setHeading(heading: number): void {
    this.mpEntity.setHeading(heading);
  }

  public setModel(value: string): void {
    this.mpEntity.model = mp.game.joaat(value);
  }

  public setRotation(value: Vector3D): void {
    this.mpEntity.rotation = new mp.Vector3(value);
  }

  public get forwardVector(): Vector3D {
    const vector = this.mpEntity.getForwardVector();
    return new Vector3D(vector.x, vector.y, vector.z);
  }

  public freezePosition(freeze: boolean): void {
    this.mpEntity.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this.mpEntity.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this.mpEntity.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this.mpEntity.setVisible(visible, false);
  }

  public setAlpha(alpha: number): void {
    this.mpEntity.setAlpha(alpha);
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }
}
