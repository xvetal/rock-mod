/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Vehicle as VimpVehicle } from "@vimp-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IRGB, type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type ILightState, type IVehicle } from "../../common/vehicle/IVehicle";

export type IVIMPNativeVehicle = VimpVehicle;

type VimpVehicleWithNumberPlateType = VimpVehicle & {
  setNumberPlateType(index: number): void;
};

export class VIMPVehicle implements IVehicle {
  private _destroyed = false;

  public constructor(
    private readonly _vimpVehicle: IVIMPNativeVehicle,
    private readonly _onDestroy: (vehicle: VIMPVehicle) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpVehicle.id;
  }

  public get remoteId(): number | null {
    return this._vimpVehicle.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public get isExists(): boolean {
    if (this._destroyed) return false;
    if (this._vimpVehicle.isRemote) return this._getRemoteVehicleExists();
    return this._vimpVehicle.isExists;
  }

  public get handle(): number {
    return this._normalizeHandle(this._vimpVehicle.handle);
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._vimpVehicle.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpVehicle.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpVehicle.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._vimpVehicle.setPosition(value);
  }

  public setDimension(value: number): void {
    this._vimpVehicle.setDimension(value);
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
    this._vimpVehicle.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._vimpVehicle.model;
  }

  public get heading(): number {
    return this._vimpVehicle.heading;
  }

  public setHeading(heading: number): void {
    this._vimpVehicle.setHeading(heading);
  }

  public setModel(value: string): void {
    this._vimpVehicle.setModel(value);
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._vimpVehicle.rotation;
    return new Vector3D(x, y, z);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._vimpVehicle.forwardVector;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._vimpVehicle.setRotation(value);
  }

  public freezePosition(freeze: boolean): void {
    this._vimpVehicle.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._vimpVehicle.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._vimpVehicle.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._vimpVehicle.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._vimpVehicle.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._vimpVehicle.alpha;
  }

  public resetAlpha(): void {
    this._vimpVehicle.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._vimpVehicle.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._vimpVehicle.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._vimpVehicle.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) return null;

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Vehicle, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) return undefined;

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) return false;

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) return [];

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Vehicle, remoteId);
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
    this._vimpVehicle.attachToEntity(
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
    this._vimpVehicle.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._vimpVehicle.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._vimpVehicle.isPlayingAnim(dictionary, name, taskFlag);
  }

  public get bodyHealth(): number {
    return this._vimpVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._vimpVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return this._vimpVehicle.numberPlate;
  }

  public get isDead(): boolean {
    return this._vimpVehicle.isDead;
  }

  public setBodyHealth(value: number): void {
    this._vimpVehicle.setBodyHealth(value);
  }

  public setEngineHealth(value: number): void {
    this._vimpVehicle.setEngineHealth(value);
  }

  public setNumberPlate(value: string): void {
    this._vimpVehicle.setNumberPlate(value);
  }

  public explode(): void {
    this._vimpVehicle.explode();
  }

  public getPedInSeat(seat: number): number {
    return this._vimpVehicle.getPedInSeat(seat);
  }

  public setUndriveable(toggle: boolean): void {
    this._vimpVehicle.setUndriveable(toggle);
  }

  public get maxNumberOfPassengers(): number {
    return this._vimpVehicle.maxNumberOfPassengers;
  }

  public get gear(): number {
    return this._vimpVehicle.gear;
  }

  public get speed(): number {
    return this._vimpVehicle.speed;
  }

  public get isEngineRunning(): boolean {
    return this._vimpVehicle.isEngineRunning;
  }

  public setEngineOn(toggle: boolean, instantly: boolean, otherwise: boolean): void {
    this._vimpVehicle.setEngineOn(toggle, instantly, otherwise);
  }

  public get lightsState(): ILightState {
    return this._vimpVehicle.lightsState;
  }

  public get isLocked(): boolean {
    return this._vimpVehicle.isLocked;
  }

  public setIsLocked(value: boolean): void {
    this._vimpVehicle.setIsLocked(value);
  }

  public setCustomPrimaryColour(color: IRGB): void {
    this._vimpVehicle.setCustomPrimaryColour(color);
  }

  public setCustomSecondaryColour(color: IRGB): void {
    this._vimpVehicle.setCustomSecondaryColour(color);
  }

  public get customPrimaryColour(): IRGB {
    return this._vimpVehicle.customPrimaryColour;
  }

  public get customSecondaryColour(): IRGB {
    return this._vimpVehicle.customSecondaryColour;
  }

  public setMod(modType: number, modIndex: number): void {
    this._vimpVehicle.setMod(modType, modIndex);
  }

  public getMod(modType: number): number {
    return this._vimpVehicle.getMod(modType);
  }

  public getNumMods(modType: number): number {
    return this._vimpVehicle.getNumMods(modType);
  }

  public setNeonLightEnabled(index: number, toggle: boolean): void {
    this._vimpVehicle.setNeonLightEnabled(index, toggle);
  }

  public setNeonLightsColour(color: IRGB): void {
    this._vimpVehicle.setNeonLightsColour(color);
  }

  public setWindowTint(tintType: number): void {
    this._vimpVehicle.setWindowTint(tintType);
  }

  public get windowTint(): number {
    return this._vimpVehicle.windowTint;
  }

  public setWheelType(wheelType: number): void {
    this._vimpVehicle.setWheelType(wheelType);
  }

  public get wheelType(): number {
    return this._vimpVehicle.wheelType;
  }

  public setNumberPlateType(index: number): void {
    (this._vimpVehicle as VimpVehicleWithNumberPlateType).setNumberPlateType(index);
  }

  public get numberPlateType(): number {
    return this._vimpVehicle.numberPlateType;
  }

  public setDoorOpen(doorIndex: number, loose: boolean, openInstantly: boolean): void {
    this._vimpVehicle.setDoorOpen(doorIndex, loose, openInstantly);
  }

  public setDoorShut(doorIndex: number, instantly: boolean): void {
    this._vimpVehicle.setDoorShut(doorIndex, instantly);
  }

  public setHandling(field: string, value: number): void {
    this._vimpVehicle.setHandling(field, value);
  }

  public getHandling(field: string): number {
    return this._vimpVehicle.getHandling(field);
  }

  public setEnginePowerMultiplier(value: number): void {
    this._vimpVehicle.setEnginePowerMultiplier(value);
  }

  public setEngineTorqueMultiplier(value: number): void {
    this._vimpVehicle.setEngineTorqueMultiplier(value);
  }

  public modifyTopSpeed(value: number): void {
    this._vimpVehicle.modifyTopSpeed(value);
  }

  public setCheatPowerIncrease(value: number): void {
    this._vimpVehicle.setCheatPowerIncrease(value);
  }

  public toggleMod(modType: number, toggle: boolean): void {
    this._vimpVehicle.toggleMod(modType, toggle);
  }

  public setTyreSmokeColor(r: number, g: number, b: number): void {
    this._vimpVehicle.setTyreSmokeColor(r, g, b);
  }

  public setModColor1(paintType: number, color: number, p3: number): void {
    this._vimpVehicle.setModColor1(paintType, color, p3);
  }

  public setExtraColours(pearlescentColor: number, wheelColor: number): void {
    this._vimpVehicle.setExtraColours(pearlescentColor, wheelColor);
  }

  public setHeadlightColor(colorIndex: number): void {
    this._vimpVehicle.setHeadlightColor(colorIndex);
  }

  public setDashboardColor(colorIndex: number): void {
    this._vimpVehicle.setDashboardColor(colorIndex);
  }

  public setInteriorColor(colorIndex: number): void {
    this._vimpVehicle.setInteriorColor(colorIndex);
  }

  public getMaxBraking(): number {
    return this._vimpVehicle.getMaxBraking();
  }

  public getAcceleration(): number {
    return this._vimpVehicle.getAcceleration();
  }

  public getMaxTraction(): number {
    return this._vimpVehicle.getMaxTraction();
  }

  public getModelMaxSpeed(): number {
    return this._vimpVehicle.getModelMaxSpeed();
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }

  private _getRemoteVehicleExists(): boolean {
    try {
      return this._vimpVehicle.isExists;
    } catch {
      return true;
    }
  }
}
