/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Object as VimpObject } from "@vimp-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IObject } from "../../common/object/IObject";

export class VIMPObject implements IObject {
  private _destroyed = false;

  public constructor(
    private readonly _vimpObject: VimpObject,
    private readonly _onDestroy: (object: VIMPObject) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpObject.id;
  }

  public get remoteId(): number | null {
    return this._vimpObject.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._vimpObject.isExists;
  }

  public get handle(): number {
    return this._normalizeHandle(this._vimpObject.handle);
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._vimpObject.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpObject.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpObject.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._vimpObject.setPosition(value);
  }

  public setDimension(value: number): void {
    this._vimpObject.setDimension(value);
  }

  public setCoords(
    xPos: number,
    yPos: number,
    zPos: number,
    xAxis: boolean,
    yAxis: boolean,
    zAxis: boolean,
    clearArea: boolean,
  ): void {
    this._vimpObject.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._vimpObject.model;
  }

  public get heading(): number {
    return this._vimpObject.heading;
  }

  public setHeading(heading: number): void {
    this._vimpObject.setHeading(heading);
  }

  public setModel(value: string): void {
    this._vimpObject.setModel(value);
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._vimpObject.rotation;
    return new Vector3D(x, y, z);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._vimpObject.forwardVector;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._vimpObject.setRotation(value);
  }

  public freezePosition(freeze: boolean): void {
    this._vimpObject.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._vimpObject.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._vimpObject.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._vimpObject.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._vimpObject.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._vimpObject.alpha;
  }

  public resetAlpha(): void {
    this._vimpObject.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._vimpObject.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._vimpObject.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._vimpObject.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) return null;

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Object, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) return undefined;

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) return false;

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) return [];

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Object, remoteId);
  }

  public attachTo(
    entity: Handle,
    boneIndex: number,
    xPos: number,
    yPos: number,
    zPos: number,
    xRot: number,
    yRot: number,
    zRot: number,
    useSoftPinning: boolean,
    collision: boolean,
    isPed: boolean,
    vertexIndex: number,
    fixedRot: boolean,
  ): void {
    this._vimpObject.attachTo(
      entity,
      boneIndex,
      xPos,
      yPos,
      zPos,
      xRot,
      yRot,
      zRot,
      useSoftPinning,
      collision,
      isPed,
      vertexIndex,
      fixedRot,
    );
  }

  public isAttachedTo(entity: number): boolean {
    return this._vimpObject.isAttachedTo(entity);
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
    this._vimpObject.attachToEntity(
      target,
      boneIndex,
      offset,
      rotation,
      p9,
      useSoftPinning,
      collision,
      isPed,
      vertexIndex,
      fixedRot,
    );
  }

  public detach(useDetachVelocity: boolean, collision: boolean): void {
    this._vimpObject.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._vimpObject.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._vimpObject.isPlayingAnim(dictionary, name, taskFlag);
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }
}
