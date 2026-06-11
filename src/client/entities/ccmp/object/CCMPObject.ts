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
    const handle = Number(this._ccmpObject.handle);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
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
    this.setCoords(value.x, value.y, value.z, false, false, false, false);
  }

  public setDimension(_value: number): void {
    notImplemented("setDimension");
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
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityCoords(handle, xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
    });
  }

  public get model(): number {
    return this._ccmpObject.model;
  }

  public get heading(): number {
    return this._ccmpObject.heading;
  }

  public setHeading(heading: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityHeading(handle, heading);
    });
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

  public setRotation(value: IVector3D): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityRotation(handle, value.x, value.y, value.z, 2, true);
    });
  }

  public freezePosition(freeze: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.freezeEntityPosition(handle, freeze);
    });
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityCollision(handle, collision, keepPhysics);
    });
  }

  public setInvincible(invincible: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityInvincible(handle, invincible, true);
    });
  }

  public setVisible(visible: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityVisible(handle, visible, false);
    });
  }

  public setAlpha(alpha: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityAlpha(handle, alpha, false);
    });
  }

  public get alpha(): number {
    return this._withHandle(this._ccmpObject.alpha, (handle) => ccmp.natives.entity.getEntityAlpha(handle));
  }

  public resetAlpha(): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.resetEntityAlpha(handle);
    });
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
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Object, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

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
    const targetHandle = this._normalizeHandle(entity);
    if (!targetHandle) return;

    this._withHandleVoid((handle) => {
      ccmp.natives.entity.attachEntityToEntity(
        handle,
        targetHandle,
        boneIndex,
        xPos,
        yPos,
        zPos,
        xRot,
        yRot,
        zRot,
        false,
        useSoftPinning,
        collision,
        isPed,
        vertexIndex,
        fixedRot,
        0,
      );
    });
  }

  public isAttachedTo(entity: number): boolean {
    const targetHandle = this._normalizeHandle(entity);
    if (!targetHandle) return false;

    return this._withHandle(false, (handle) => ccmp.natives.entity.isEntityAttachedToEntity(handle, targetHandle));
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
    const targetHandle = this._normalizeHandle(target.handle);
    if (!targetHandle) return;

    this._withHandleVoid((handle) => {
      ccmp.natives.entity.attachEntityToEntity(
        handle,
        targetHandle,
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
        0,
      );
    });
  }

  public detach(useDetachVelocity: boolean, collision: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.detachEntity(handle, useDetachVelocity, collision);
    });
  }

  public getSpeed(): number {
    return this._withHandle(0, (handle) => ccmp.natives.entity.getEntitySpeed(handle));
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._withHandle(false, (handle) =>
      ccmp.natives.entity.isEntityPlayingAnim(handle, dictionary, name, taskFlag),
    );
  }

  private _withHandle<T>(fallback: T, callback: (handle: number) => T): T {
    const handle = this.handle;
    if (!handle) {
      return fallback;
    }

    return callback(handle);
  }

  private _withHandleVoid(callback: (handle: number) => void): void {
    const handle = this.handle;
    if (!handle) {
      return;
    }

    callback(handle);
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
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
