/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type Object as CcmpObject } from "@classic-mp/types/client";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IObject } from "../../common/object/IObject";

const notImplemented = (memberName: string): never => {
  throw new Error(`CCMPObject.${memberName}: not implemented`);
};

export class CCMPObject implements IObject {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpObject: CcmpObject,
    private readonly _onDestroy: (object: CCMPObject) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpObject.id;
  }

  public get remoteId(): number {
    return this._ccmpObject.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpObject.isExists;
  }

  public get handle(): number {
    const handle = Number(this._ccmpObject.handle);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpObject.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpObject.dimension;
  }

  public setPosition(_value: IVector3D): void {
    notImplemented("setPosition");
  }

  public setDimension(_value: number): void {
    notImplemented("setDimension");
  }

  public setCoords(
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xAxis: boolean,
    _yAxis: boolean,
    _zAxis: boolean,
    _clearArea: boolean,
  ): void {
    notImplemented("setCoords");
  }

  public get model(): number {
    return this._ccmpObject.model;
  }

  public get heading(): number {
    return this._ccmpObject.heading;
  }

  public setHeading(_heading: number): void {
    notImplemented("setHeading");
  }

  public setModel(_value: string): void {
    notImplemented("setModel");
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpObject.rotation;
    return new Vector3D(x, y, z);
  }

  public get forwardVector(): Vector3D {
    const headingRad = (this.heading * Math.PI) / 180;
    return new Vector3D(-Math.sin(headingRad), Math.cos(headingRad), 0);
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("setRotation");
  }

  public freezePosition(_freeze: boolean): void {
    notImplemented("freezePosition");
  }

  public setCollision(_collision: boolean, _keepPhysics: boolean): void {
    notImplemented("setCollision");
  }

  public setInvincible(_invincible: boolean): void {
    notImplemented("setInvincible");
  }

  public setVisible(_visible: boolean): void {
    notImplemented("setVisible");
  }

  public setAlpha(_alpha: number): void {
    notImplemented("setAlpha");
  }

  public get alpha(): number {
    return this._ccmpObject.alpha;
  }

  public resetAlpha(): void {
    notImplemented("resetAlpha");
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    return this._withHandle(this._getOffsetFromCachedTransform(offsetX, offsetY, offsetZ), (handle) => {
      const { x, y, z } = ccmp.natives.entity.getOffsetFromEntityInWorldCoords(handle, offsetX, offsetY, offsetZ);
      return new Vector3D(x, y, z);
    });
  }

  public getBoneIndexByName(boneName: string): number {
    return this._withHandle(-1, (handle) => ccmp.natives.entity.getEntityBoneIndexByName(handle, boneName));
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    return this._withHandle(this.position, (handle) => {
      const { x, y, z } = ccmp.natives.entity.getWorldPositionOfEntityBone(handle, boneIndex);
      return new Vector3D(x, y, z);
    });
  }

  public getVariable(name: string): unknown | null {
    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, this.remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, this.remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, this.remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Object, this.remoteId);
  }

  public attachTo(
    _entity: Handle,
    _boneIndex: number,
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xRot: number,
    _yRot: number,
    _zRot: number,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    notImplemented("attachTo");
  }

  public isAttachedTo(_entity: number): boolean {
    return notImplemented("isAttachedTo");
  }

  public attachToEntity(
    _target: IBaseObject,
    _boneIndex: number,
    _offset: IVector3D,
    _rotation: IVector3D,
    _p9: boolean,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    notImplemented("attachToEntity");
  }

  public detach(_useDetachVelocity: boolean, _collision: boolean): void {
    notImplemented("detach");
  }

  public getSpeed(): number {
    return this._withHandle(0, (handle) => ccmp.natives.entity.getEntitySpeed(handle));
  }

  public isPlayingAnim(_dictionary: string, _name: string, _taskFlag: number): boolean {
    return notImplemented("isPlayingAnim");
  }

  private _withHandle<T>(fallback: T, callback: (handle: number) => T): T {
    const handle = this.handle;
    if (!handle) {
      return fallback;
    }

    return callback(handle);
  }

  private _getOffsetFromCachedTransform(offsetX: number, offsetY: number, offsetZ: number): Vector3D {
    const position = this.position;
    const headingRad = (this.heading * Math.PI) / 180;
    const rightX = Math.cos(headingRad);
    const rightY = Math.sin(headingRad);
    const forwardX = -Math.sin(headingRad);
    const forwardY = Math.cos(headingRad);

    return new Vector3D(
      position.x + rightX * offsetX + forwardX * offsetY,
      position.y + rightY * offsetX + forwardY * offsetY,
      position.z + offsetZ,
    );
  }
}
