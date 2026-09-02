/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Object as CcmpObject } from "@classic-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IObject } from "../../common/object/IObject";

export class CCMPObject implements IObject {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpObject: CcmpObject,
    private readonly _onDestroy: (object: CCMPObject) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpObject.id;
  }

  public get remoteId(): number | null {
    return this._ccmpObject.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpObject.isExists;
  }

  public get handle(): number {
    return this._normalizeHandle(this._ccmpObject.handle);
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._ccmpObject.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpObject.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpObject.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._ccmpObject.setPosition(value);
  }

  public setDimension(value: number): void {
    this._ccmpObject.setDimension(value);
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
    this._ccmpObject.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._ccmpObject.model;
  }

  public get heading(): number {
    return this._ccmpObject.heading;
  }

  public setHeading(heading: number): void {
    this._ccmpObject.setHeading(heading);
  }

  public setModel(value: string): void {
    this._ccmpObject.setModel(value);
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpObject.rotation;
    return new Vector3D(x, y, z);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._ccmpObject.forwardVector;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._ccmpObject.setRotation(value);
  }

  public freezePosition(freeze: boolean): void {
    this._ccmpObject.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._ccmpObject.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._ccmpObject.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._ccmpObject.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._ccmpObject.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._ccmpObject.alpha;
  }

  public resetAlpha(): void {
    this._ccmpObject.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._ccmpObject.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._ccmpObject.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._ccmpObject.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) return null;

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) return undefined;

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) return false;

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) return [];

    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Object, remoteId);
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
    this._ccmpObject.attachTo(
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
    return this._ccmpObject.isAttachedTo(entity);
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
    this._ccmpObject.attachToEntity(
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
    this._ccmpObject.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._ccmpObject.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._ccmpObject.isPlayingAnim(dictionary, name, taskFlag);
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }
}
