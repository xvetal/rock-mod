/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Vehicle as CcmpVehicle } from "@classic-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IRGB, type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type ILightState, type IVehicle } from "../../common/vehicle/IVehicle";

export type ICCMPNativeVehicle = CcmpVehicle;

type CcmpVehicleWithNumberPlateType = CcmpVehicle & {
  setNumberPlateType(index: number): void;
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

  public get remoteId(): number | null {
    return this._ccmpVehicle.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public get isExists(): boolean {
    if (this._destroyed) return false;
    if (this._ccmpVehicle.isRemote) return this._getRemoteVehicleExists();
    return this._ccmpVehicle.isExists;
  }

  public get handle(): number {
    return this._normalizeHandle(this._ccmpVehicle.handle);
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._ccmpVehicle.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpVehicle.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._ccmpVehicle.setPosition(value);
  }

  public setDimension(value: number): void {
    this._ccmpVehicle.setDimension(value);
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
    this._ccmpVehicle.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._ccmpVehicle.model;
  }

  public get heading(): number {
    return this._ccmpVehicle.heading;
  }

  public setHeading(heading: number): void {
    this._ccmpVehicle.setHeading(heading);
  }

  public setModel(value: string): void {
    this._ccmpVehicle.setModel(value);
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.rotation;
    return new Vector3D(x, y, z);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.forwardVector;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._ccmpVehicle.setRotation(value);
  }

  public freezePosition(freeze: boolean): void {
    this._ccmpVehicle.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._ccmpVehicle.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._ccmpVehicle.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._ccmpVehicle.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._ccmpVehicle.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._ccmpVehicle.alpha;
  }

  public resetAlpha(): void {
    this._ccmpVehicle.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._ccmpVehicle.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._ccmpVehicle.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._ccmpVehicle.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) return null;

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) return undefined;

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) return false;

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) return [];

    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId);
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
    this._ccmpVehicle.attachToEntity(
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
    this._ccmpVehicle.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._ccmpVehicle.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._ccmpVehicle.isPlayingAnim(dictionary, name, taskFlag);
  }

  public get bodyHealth(): number {
    return this._ccmpVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._ccmpVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return this._ccmpVehicle.numberPlate;
  }

  public get isDead(): boolean {
    return this._ccmpVehicle.isDead;
  }

  public setBodyHealth(value: number): void {
    this._ccmpVehicle.setBodyHealth(value);
  }

  public setEngineHealth(value: number): void {
    this._ccmpVehicle.setEngineHealth(value);
  }

  public setNumberPlate(value: string): void {
    this._ccmpVehicle.setNumberPlate(value);
  }

  public explode(): void {
    this._ccmpVehicle.explode();
  }

  public getPedInSeat(seat: number): number {
    return this._ccmpVehicle.getPedInSeat(seat);
  }

  public setUndriveable(toggle: boolean): void {
    this._ccmpVehicle.setUndriveable(toggle);
  }

  public get maxNumberOfPassengers(): number {
    return this._ccmpVehicle.maxNumberOfPassengers;
  }

  public get gear(): number {
    return this._ccmpVehicle.gear;
  }

  public get speed(): number {
    return this._ccmpVehicle.speed;
  }

  public get isEngineRunning(): boolean {
    return this._ccmpVehicle.isEngineRunning;
  }

  public setEngineOn(toggle: boolean, instantly: boolean, otherwise: boolean): void {
    this._ccmpVehicle.setEngineOn(toggle, instantly, otherwise);
  }

  public get lightsState(): ILightState {
    return this._ccmpVehicle.lightsState;
  }

  public get isLocked(): boolean {
    return this._ccmpVehicle.isLocked;
  }

  public setIsLocked(value: boolean): void {
    this._ccmpVehicle.setIsLocked(value);
  }

  public setCustomPrimaryColour(color: IRGB): void {
    this._ccmpVehicle.setCustomPrimaryColour(color);
  }

  public setCustomSecondaryColour(color: IRGB): void {
    this._ccmpVehicle.setCustomSecondaryColour(color);
  }

  public get customPrimaryColour(): IRGB {
    return this._ccmpVehicle.customPrimaryColour;
  }

  public get customSecondaryColour(): IRGB {
    return this._ccmpVehicle.customSecondaryColour;
  }

  public setMod(modType: number, modIndex: number): void {
    this._ccmpVehicle.setMod(modType, modIndex);
  }

  public getMod(modType: number): number {
    return this._ccmpVehicle.getMod(modType);
  }

  public getNumMods(modType: number): number {
    return this._ccmpVehicle.getNumMods(modType);
  }

  public setNeonLightEnabled(index: number, toggle: boolean): void {
    this._ccmpVehicle.setNeonLightEnabled(index, toggle);
  }

  public setNeonLightsColour(color: IRGB): void {
    this._ccmpVehicle.setNeonLightsColour(color);
  }

  public setWindowTint(tintType: number): void {
    this._ccmpVehicle.setWindowTint(tintType);
  }

  public get windowTint(): number {
    return this._ccmpVehicle.windowTint;
  }

  public setWheelType(wheelType: number): void {
    this._ccmpVehicle.setWheelType(wheelType);
  }

  public get wheelType(): number {
    return this._ccmpVehicle.wheelType;
  }

  public setNumberPlateType(index: number): void {
    (this._ccmpVehicle as CcmpVehicleWithNumberPlateType).setNumberPlateType(index);
  }

  public get numberPlateType(): number {
    return this._ccmpVehicle.numberPlateType;
  }

  public setDoorOpen(doorIndex: number, loose: boolean, openInstantly: boolean): void {
    this._ccmpVehicle.setDoorOpen(doorIndex, loose, openInstantly);
  }

  public setDoorShut(doorIndex: number, instantly: boolean): void {
    this._ccmpVehicle.setDoorShut(doorIndex, instantly);
  }

  public setHandling(field: string, value: number): void {
    this._ccmpVehicle.setHandling(field, value);
  }

  public getHandling(field: string): number {
    return this._ccmpVehicle.getHandling(field);
  }

  public setEnginePowerMultiplier(value: number): void {
    this._ccmpVehicle.setEnginePowerMultiplier(value);
  }

  public setEngineTorqueMultiplier(value: number): void {
    this._ccmpVehicle.setEngineTorqueMultiplier(value);
  }

  public modifyTopSpeed(value: number): void {
    this._ccmpVehicle.modifyTopSpeed(value);
  }

  public setCheatPowerIncrease(value: number): void {
    this._ccmpVehicle.setCheatPowerIncrease(value);
  }

  public toggleMod(modType: number, toggle: boolean): void {
    this._ccmpVehicle.toggleMod(modType, toggle);
  }

  public setTyreSmokeColor(r: number, g: number, b: number): void {
    this._ccmpVehicle.setTyreSmokeColor(r, g, b);
  }

  public setModColor1(paintType: number, color: number, p3: number): void {
    this._ccmpVehicle.setModColor1(paintType, color, p3);
  }

  public setExtraColours(pearlescentColor: number, wheelColor: number): void {
    this._ccmpVehicle.setExtraColours(pearlescentColor, wheelColor);
  }

  public setHeadlightColor(colorIndex: number): void {
    this._ccmpVehicle.setHeadlightColor(colorIndex);
  }

  public setDashboardColor(colorIndex: number): void {
    this._ccmpVehicle.setDashboardColor(colorIndex);
  }

  public setInteriorColor(colorIndex: number): void {
    this._ccmpVehicle.setInteriorColor(colorIndex);
  }

  public getMaxBraking(): number {
    return this._ccmpVehicle.getMaxBraking();
  }

  public getAcceleration(): number {
    return this._ccmpVehicle.getAcceleration();
  }

  public getMaxTraction(): number {
    return this._ccmpVehicle.getMaxTraction();
  }

  public getModelMaxSpeed(): number {
    return this._ccmpVehicle.getModelMaxSpeed();
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }

  private _getRemoteVehicleExists(): boolean {
    try {
      return this._ccmpVehicle.isExists;
    } catch {
      return true;
    }
  }
}
