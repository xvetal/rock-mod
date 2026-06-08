import { type IBaseObject } from "../../common/baseObject";
import { type IEntity } from "../../common/entity/IEntity";
import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";

export interface IRageEntityOptions<T extends EntityMp> extends IRageWorldObjectOptions<T> {}

export abstract class RageEntity<T extends EntityMp> extends RageWorldObject<T> implements IEntity {
  public get model(): number {
    return this.mpEntity.model;
  }

  public get rotation(): Vector3D {
    return this._getNativeRotation() ?? this._getEntityRotationProperty() ?? new Vector3D(0, 0, this.heading);
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

    if (this._hasValidHandle()) {
      mp.game.entity.setRotation(this.handle, value.x, value.y, value.z, 2, true);
    }
  }

  public get forwardVector(): Vector3D {
    const vector = this.mpEntity.getForwardVector();
    return new Vector3D(vector.x, vector.y, vector.z);
  }

  public freezePosition(freeze: boolean): void {
    // FREEZE_ENTITY_POSITION via raw native: the RAGEMP wrapper does not consistently
    // toggle the engine-level freeze for client-spawned entities, leaving them frozen.
    mp.game.invoke("0x428CA6DBD1094446", this.handle, freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    // SET_ENTITY_COLLISION via raw native for the same reason as freezePosition above.
    mp.game.invoke("0x1A9205C1B9EE827F", this.handle, collision, keepPhysics);
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

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this.mpEntity.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public resetAlpha(): void {
    this.mpEntity.resetAlpha();
  }

  public getBoneIndexByName(boneName: string): number {
    return this.mpEntity.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this.mpEntity.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    return this.mpEntity.getVariable(name);
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const value = this.mpEntity.getVariable(key);
    return value === null ? undefined : value;
  }

  public hasSyncedMeta(key: string): boolean {
    return this.mpEntity.getVariable(key) !== null;
  }

  public getSyncedMetaKeys(): readonly string[] {
    // RageMP не экспонирует список ключей синхронно — возвращаем пустой массив.
    return [];
  }

  public attachToEntity(
    target: IBaseObject,
    boneIndex: number,
    offset: IVector3D,
    rotation: IVector3D,
    p9: boolean,
    useSoftPinning: boolean,
    collision: boolean,
    isPed: boolean,
    vertexIndex: number,
    fixedRot: boolean,
  ): void {
    mp.game.entity.attachToEntity(
      this.handle,
      target.handle,
      boneIndex,
      offset.x,
      offset.y,
      offset.z,
      rotation.x,
      rotation.y,
      rotation.z,
      p9,
      useSoftPinning,
      collision,
      isPed,
      vertexIndex,
      fixedRot,
    );
  }

  public detach(useDetachVelocity: boolean, collision: boolean): void {
    mp.game.entity.detach(this.handle, useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return mp.game.entity.getSpeed(this.handle);
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return mp.game.entity.isPlayingAnim(this.handle, dictionary, name, taskFlag);
  }

  private _getNativeRotation(): Vector3D | null {
    if (!this._hasValidHandle()) return null;

    try {
      const rotation = mp.game.entity.getRotation(this.handle, 2);
      if (!this._isVectorLike(rotation)) return null;
      return new Vector3D(rotation.x, rotation.y, rotation.z);
    } catch {
      return null;
    }
  }

  private _getEntityRotationProperty(): Vector3D | null {
    const rotation = (this.mpEntity as { rotation?: unknown }).rotation;
    if (!this._isVectorLike(rotation)) return null;
    return new Vector3D(rotation.x, rotation.y, rotation.z);
  }

  private _hasValidHandle(): boolean {
    return typeof this.handle === "number" && this.handle > 0;
  }

  private _isVectorLike(value: unknown): value is IVector3D {
    return (
      typeof value === "object" &&
      value !== null &&
      typeof (value as IVector3D).x === "number" &&
      typeof (value as IVector3D).y === "number" &&
      typeof (value as IVector3D).z === "number"
    );
  }
}
