/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType } from "@shared/entities";
import { type IRGB, type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type ILightState, type IVehicle } from "../../common/vehicle/IVehicle";

export interface ICCMPNativeVehicle {
  readonly id: number;
  readonly remoteId: number;
  readonly isRemote: boolean;
  readonly handle: number;
  readonly model: number;
  readonly dimension: number;
  readonly isAlive: boolean;
  readonly isExists?: boolean;
  readonly position: IVector3D;
  readonly rotation: IVector3D;
  readonly heading: number;
  readonly numberPlateText: string;
  readonly numberPlate: string;
}

const notImplemented = (memberName: string): never => {
  throw new Error(`CCMPVehicle.${memberName}: not implemented`);
};

export class CCMPVehicle implements IVehicle {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpVehicle: ICCMPNativeVehicle,
    private readonly _onDestroy: (vehicle: CCMPVehicle) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpVehicle.id;
  }

  public get remoteId(): number {
    return this._ccmpVehicle.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public get isExists(): boolean {
    if (this._destroyed) return false;
    if (this._ccmpVehicle.isRemote) {
      return this._getRemoteVehicleExists();
    }

    return !this._destroyed && (this._ccmpVehicle.isExists ?? this._ccmpVehicle.isAlive);
  }

  public get handle(): number {
    const handle = Number(this._ccmpVehicle.handle);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpVehicle.dimension;
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
    return this._ccmpVehicle.model;
  }

  public get heading(): number {
    return this._ccmpVehicle.heading;
  }

  public setHeading(_heading: number): void {
    notImplemented("setHeading");
  }

  public setModel(_value: string): void {
    notImplemented("setModel");
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.rotation;
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

  public setAlpha(alpha: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityAlpha(handle, alpha, false);
    });
  }

  public get alpha(): number {
    return this._withHandle(255, (handle) => ccmp.natives.entity.getEntityAlpha(handle));
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
    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, this.remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, this.remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, this.remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Vehicle, this.remoteId);
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
    return notImplemented("getSpeed");
  }

  public isPlayingAnim(_dictionary: string, _name: string, _taskFlag: number): boolean {
    return notImplemented("isPlayingAnim");
  }

  public get bodyHealth(): number {
    return notImplemented("bodyHealth");
  }

  public get engineHealth(): number {
    return notImplemented("engineHealth");
  }

  public get numberPlate(): string {
    return this._ccmpVehicle.numberPlate ?? this._ccmpVehicle.numberPlateText;
  }

  public get isDead(): boolean {
    return !this.isExists;
  }

  public setBodyHealth(_value: number): void {
    notImplemented("setBodyHealth");
  }

  public setEngineHealth(_value: number): void {
    notImplemented("setEngineHealth");
  }

  public setNumberPlate(_value: string): void {
    notImplemented("setNumberPlate");
  }

  public explode(): void {
    notImplemented("explode");
  }

  public getPedInSeat(_seat: number): number {
    return notImplemented("getPedInSeat");
  }

  public setUndriveable(_toggle: boolean): void {
    notImplemented("setUndriveable");
  }

  public get maxNumberOfPassengers(): number {
    return notImplemented("maxNumberOfPassengers");
  }

  public get gear(): number {
    return notImplemented("gear");
  }

  public get speed(): number {
    return notImplemented("speed");
  }

  public get isEngineRunning(): boolean {
    return notImplemented("isEngineRunning");
  }

  public setEngineOn(_toggle: boolean, _instantly: boolean, _otherwise: boolean): void {
    notImplemented("setEngineOn");
  }

  public get lightsState(): ILightState {
    return notImplemented("lightsState");
  }

  public get isLocked(): boolean {
    return notImplemented("isLocked");
  }

  public setIsLocked(_value: boolean): void {
    notImplemented("setIsLocked");
  }

  public setCustomPrimaryColour(_color: IRGB): void {
    notImplemented("setCustomPrimaryColour");
  }

  public setCustomSecondaryColour(_color: IRGB): void {
    notImplemented("setCustomSecondaryColour");
  }

  public get customPrimaryColour(): IRGB {
    return notImplemented("customPrimaryColour");
  }

  public get customSecondaryColour(): IRGB {
    return notImplemented("customSecondaryColour");
  }

  public setMod(_modType: number, _modIndex: number): void {
    notImplemented("setMod");
  }

  public getMod(_modType: number): number {
    return notImplemented("getMod");
  }

  public getNumMods(_modType: number): number {
    return notImplemented("getNumMods");
  }

  public setNeonLightEnabled(_index: number, _toggle: boolean): void {
    notImplemented("setNeonLightEnabled");
  }

  public setNeonLightsColour(_color: IRGB): void {
    notImplemented("setNeonLightsColour");
  }

  public setWindowTint(_tintType: number): void {
    notImplemented("setWindowTint");
  }

  public get windowTint(): number {
    return notImplemented("windowTint");
  }

  public setWheelType(_wheelType: number): void {
    notImplemented("setWheelType");
  }

  public get wheelType(): number {
    return notImplemented("wheelType");
  }

  public setNumberPlateTextIndex(_index: number): void {
    notImplemented("setNumberPlateTextIndex");
  }

  public get numberPlateTextIndex(): number {
    return notImplemented("numberPlateTextIndex");
  }

  public setDoorOpen(_doorIndex: number, _loose: boolean, _openInstantly: boolean): void {
    notImplemented("setDoorOpen");
  }

  public setDoorShut(_doorIndex: number, _instantly: boolean): void {
    notImplemented("setDoorShut");
  }

  public setHandling(_field: string, _value: number): void {
    notImplemented("setHandling");
  }

  public getHandling(_field: string): number {
    return notImplemented("getHandling");
  }

  public setEnginePowerMultiplier(_value: number): void {
    notImplemented("setEnginePowerMultiplier");
  }

  public setEngineTorqueMultiplier(_value: number): void {
    notImplemented("setEngineTorqueMultiplier");
  }

  public modifyTopSpeed(_value: number): void {
    notImplemented("modifyTopSpeed");
  }

  public setCheatPowerIncrease(_value: number): void {
    notImplemented("setCheatPowerIncrease");
  }

  public toggleMod(_modType: number, _toggle: boolean): void {
    notImplemented("toggleMod");
  }

  public setTyreSmokeColor(_r: number, _g: number, _b: number): void {
    notImplemented("setTyreSmokeColor");
  }

  public setModColor1(_paintType: number, _color: number, _p3: number): void {
    notImplemented("setModColor1");
  }

  public setExtraColours(_pearlescentColor: number, _wheelColor: number): void {
    notImplemented("setExtraColours");
  }

  public setHeadlightColor(_colorIndex: number): void {
    notImplemented("setHeadlightColor");
  }

  public setDashboardColor(_colorIndex: number): void {
    notImplemented("setDashboardColor");
  }

  public setInteriorColor(_colorIndex: number): void {
    notImplemented("setInteriorColor");
  }

  public getMaxBraking(): number {
    return notImplemented("getMaxBraking");
  }

  public getAcceleration(): number {
    return notImplemented("getAcceleration");
  }

  public getMaxTraction(): number {
    return notImplemented("getMaxTraction");
  }

  public getModelMaxSpeed(): number {
    return notImplemented("getModelMaxSpeed");
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

  private _getRemoteVehicleExists(): boolean {
    try {
      return this._ccmpVehicle.isExists ?? true;
    } catch {
      return true;
    }
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
