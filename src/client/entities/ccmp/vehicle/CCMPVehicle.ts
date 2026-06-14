/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType } from "@shared/entities";
import { type IRGB, type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type ILightState, type IVehicle } from "../../common/vehicle/IVehicle";

export interface ICCMPNativeVehicle {
  readonly id: number;
  readonly remoteId: number | null;
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
  destroy(): boolean;
}

type CCMPVehicleNatives = typeof ccmp.natives.vehicle & {
  setVehicleEnginePowerMultiplier?: (vehicle: number, value: number) => void;
  setVehicleEngineTorqueMultiplier?: (vehicle: number, value: number) => void;
  setVehicleDashboardColor?: (vehicle: number, colorIndex: number) => void;
  setVehicleDashboardColour?: (vehicle: number, colorIndex: number) => void;
  setVehicleInteriorColor?: (vehicle: number, colorIndex: number) => void;
  setVehicleInteriorColour?: (vehicle: number, colorIndex: number) => void;
};

export class CCMPVehicle implements IVehicle {
  private _destroyed = false;

  private readonly _handlingOverrides = new Map<string, number>();

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
    this.setCoords(value.x, value.y, value.z, false, false, false, false);
  }

  public setDimension(_value: number): void {
    // CCMP client vehicle dimensions are server/local-create metadata only.
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
    return this._ccmpVehicle.model;
  }

  public get heading(): number {
    return this._ccmpVehicle.heading;
  }

  public setHeading(heading: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityHeading(handle, heading);
    });
  }

  public setModel(_value: string): void {
    // Client-side vehicle model changes are not part of CCMP's authoritative vehicle API.
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpVehicle.rotation;
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
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Vehicle, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

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
    const targetHandle = this._normalizeHandle(target.handle);
    if (!targetHandle) return;
    const normalizedBoneIndex = this._normalizeNativeInt(boneIndex);
    const normalizedOffsetX = this._normalizeNativeNumber(offset.x);
    const normalizedOffsetY = this._normalizeNativeNumber(offset.y);
    const normalizedOffsetZ = this._normalizeNativeNumber(offset.z);
    const normalizedRotationX = this._normalizeNativeNumber(rotation.x);
    const normalizedRotationY = this._normalizeNativeNumber(rotation.y);
    const normalizedRotationZ = this._normalizeNativeNumber(rotation.z);
    const normalizedVertexIndex = this._normalizeNativeInt(vertexIndex);

    this._withHandleVoid((handle) => {
      ccmp.natives.entity.attachEntityToEntity(
        handle,
        targetHandle,
        normalizedBoneIndex,
        normalizedOffsetX,
        normalizedOffsetY,
        normalizedOffsetZ,
        normalizedRotationX,
        normalizedRotationY,
        normalizedRotationZ,
        p9,
        useSoftPinning,
        collision,
        isPed,
        normalizedVertexIndex,
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
    return this.speed;
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._withHandle(false, (handle) =>
      ccmp.natives.entity.isEntityPlayingAnim(handle, dictionary, name, taskFlag),
    );
  }

  public get bodyHealth(): number {
    return this._withHandle(1000, (handle) => ccmp.natives.vehicle.getVehicleBodyHealth(handle));
  }

  public get engineHealth(): number {
    return this._withHandle(1000, (handle) => ccmp.natives.vehicle.getVehicleEngineHealth(handle));
  }

  public get numberPlate(): string {
    return this._ccmpVehicle.numberPlate ?? this._ccmpVehicle.numberPlateText;
  }

  public get isDead(): boolean {
    return !this.isExists;
  }

  public setBodyHealth(value: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleBodyHealth(handle, value);
    });
  }

  public setEngineHealth(value: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleEngineHealth(handle, value);
    });
  }

  public setNumberPlate(value: string): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleNumberPlateText(handle, value.slice(0, 8));
    });
  }

  public explode(): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.explodeVehicle(handle, true, false);
    });
  }

  public getPedInSeat(seat: number): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getPedInVehicleSeat(handle, seat, false));
  }

  public setUndriveable(toggle: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleUndriveable(handle, toggle);
    });
  }

  public get maxNumberOfPassengers(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleMaxNumberOfPassengers(handle));
  }

  public get gear(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle._getVehicleCurrentDriveGear(handle));
  }

  public get speed(): number {
    return this._withHandle(0, (handle) => ccmp.natives.entity.getEntitySpeed(handle));
  }

  public get isEngineRunning(): boolean {
    return this._withHandle(false, (handle) => ccmp.natives.vehicle.getIsVehicleEngineRunning(handle));
  }

  public setEngineOn(toggle: boolean, instantly: boolean, otherwise: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleEngineOn(handle, toggle, instantly, otherwise);
    });
  }

  public get lightsState(): ILightState {
    return this._withHandle({ lightsOn: false, highbeamsOn: false }, (handle) => {
      const state = ccmp.natives.vehicle.getVehicleLightsState(handle);
      return { lightsOn: state.lightson, highbeamsOn: state.highbeamson };
    });
  }

  public get isLocked(): boolean {
    return this._withHandle(false, (handle) => {
      const lockStatus = ccmp.natives.vehicle.getVehicleDoorLockStatus(handle);
      return lockStatus !== 0 && lockStatus !== 1;
    });
  }

  public setIsLocked(value: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleDoorsLocked(handle, value ? 2 : 1);
    });
  }

  public setCustomPrimaryColour(color: IRGB): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleCustomPrimaryColour(handle, color.r, color.g, color.b);
    });
  }

  public setCustomSecondaryColour(color: IRGB): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleCustomSecondaryColour(handle, color.r, color.g, color.b);
    });
  }

  public get customPrimaryColour(): IRGB {
    return this._withHandle({ r: 0, g: 0, b: 0 }, (handle) =>
      ccmp.natives.vehicle.getVehicleCustomPrimaryColour(handle),
    );
  }

  public get customSecondaryColour(): IRGB {
    return this._withHandle({ r: 0, g: 0, b: 0 }, (handle) =>
      ccmp.natives.vehicle.getVehicleCustomSecondaryColour(handle),
    );
  }

  public setMod(modType: number, modIndex: number): void {
    this._withHandleVoid((handle) => {
      this._setModKit(handle);
      ccmp.natives.vehicle.setVehicleMod(handle, modType, modIndex, false);
    });
  }

  public getMod(modType: number): number {
    return this._withHandle(-1, (handle) => ccmp.natives.vehicle.getVehicleMod(handle, modType));
  }

  public getNumMods(modType: number): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getNumVehicleMods(handle, modType));
  }

  public setNeonLightEnabled(index: number, toggle: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleNeonEnabled(handle, index, toggle);
    });
  }

  public setNeonLightsColour(color: IRGB): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleNeonColour(handle, color.r, color.g, color.b);
    });
  }

  public setWindowTint(tintType: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleWindowTint(handle, tintType);
    });
  }

  public get windowTint(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleWindowTint(handle));
  }

  public setWheelType(wheelType: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleWheelType(handle, wheelType);
    });
  }

  public get wheelType(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleWheelType(handle));
  }

  public setNumberPlateTextIndex(index: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleNumberPlateTextIndex(handle, index);
    });
  }

  public get numberPlateTextIndex(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleNumberPlateTextIndex(handle));
  }

  public setDoorOpen(doorIndex: number, loose: boolean, openInstantly: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleDoorOpen(handle, doorIndex, loose, openInstantly);
    });
  }

  public setDoorShut(doorIndex: number, instantly: boolean): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleDoorShut(handle, doorIndex, instantly);
    });
  }

  public setHandling(field: string, value: number): void {
    this._handlingOverrides.set(field, this._normalizeNativeNumber(value));
  }

  public getHandling(field: string): number {
    const override = this._handlingOverrides.get(field);
    if (override !== undefined) {
      return override;
    }

    return this._withHandle(this._getDefaultHandlingValue(field), (handle) =>
      this._getNativeHandlingValue(handle, field),
    );
  }

  public setEnginePowerMultiplier(value: number): void {
    this._withHandleVoid((handle) => {
      const vehicleNatives = ccmp.natives.vehicle as CCMPVehicleNatives;
      const setEnginePowerMultiplier = vehicleNatives.setVehicleEnginePowerMultiplier;
      if (setEnginePowerMultiplier) {
        setEnginePowerMultiplier(handle, value);
        return;
      }

      ccmp.natives.vehicle.modifyVehicleTopSpeed(handle, value);
    });
  }

  public setEngineTorqueMultiplier(value: number): void {
    this._withHandleVoid((handle) => {
      const vehicleNatives = ccmp.natives.vehicle as CCMPVehicleNatives;
      const setEngineTorqueMultiplier = vehicleNatives.setVehicleEngineTorqueMultiplier;
      if (setEngineTorqueMultiplier) {
        setEngineTorqueMultiplier(handle, value);
        return;
      }

      ccmp.natives.vehicle.setVehicleCheatPowerIncrease(handle, value);
    });
  }

  public modifyTopSpeed(value: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.modifyVehicleTopSpeed(handle, value);
    });
  }

  public setCheatPowerIncrease(value: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleCheatPowerIncrease(handle, value);
    });
  }

  public toggleMod(modType: number, toggle: boolean): void {
    this._withHandleVoid((handle) => {
      this._setModKit(handle);
      ccmp.natives.vehicle.toggleVehicleMod(handle, modType, toggle);
    });
  }

  public setTyreSmokeColor(r: number, g: number, b: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleTyreSmokeColor(handle, r, g, b);
    });
  }

  public setModColor1(paintType: number, color: number, p3: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleModColor1(handle, paintType, color, p3);
    });
  }

  public setExtraColours(pearlescentColor: number, wheelColor: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleExtraColours(handle, pearlescentColor, wheelColor);
    });
  }

  public setHeadlightColor(colorIndex: number): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.vehicle.setVehicleXenonLightColorIndex(handle, colorIndex);
    });
  }

  public setDashboardColor(colorIndex: number): void {
    this._withHandleVoid((handle) => {
      const vehicleNatives = ccmp.natives.vehicle as CCMPVehicleNatives;
      const setDashboardColor = vehicleNatives.setVehicleDashboardColor ?? vehicleNatives.setVehicleDashboardColour;
      if (!setDashboardColor) return;
      setDashboardColor(handle, colorIndex);
    });
  }

  public setInteriorColor(colorIndex: number): void {
    this._withHandleVoid((handle) => {
      const vehicleNatives = ccmp.natives.vehicle as CCMPVehicleNatives;
      const setInteriorColor = vehicleNatives.setVehicleInteriorColor ?? vehicleNatives.setVehicleInteriorColour;
      if (!setInteriorColor) return;
      setInteriorColor(handle, colorIndex);
    });
  }

  public getMaxBraking(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleMaxBraking(handle));
  }

  public getAcceleration(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleAcceleration(handle));
  }

  public getMaxTraction(): number {
    return this._withHandle(0, (handle) => ccmp.natives.vehicle.getVehicleMaxTraction(handle));
  }

  public getModelMaxSpeed(): number {
    return this._withHandle(0, () => ccmp.natives.vehicle.getVehicleModelEstimatedMaxSpeed(this.model));
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

  private _setModKit(handle: number): void {
    ccmp.natives.vehicle.setVehicleModKit(handle, 0);
  }

  private _normalizeHandle(value: number): number {
    const handle = Number(value);
    return Number.isFinite(handle) && handle > 0 ? Math.trunc(handle) : 0;
  }

  private _normalizeNativeNumber(value: number): number {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : 0;
  }

  private _normalizeNativeInt(value: number): number {
    return Math.trunc(this._normalizeNativeNumber(value));
  }

  private _getNativeHandlingValue(handle: number, field: string): number {
    switch (field) {
      case "nInitialDriveGears":
        return ccmp.natives.vehicle._getVehicleMaxDriveGearCount(handle);
      case "fInitialDriveForce":
        return ccmp.natives.vehicle.getVehicleAcceleration(handle);
      case "fBrakeForce":
        return ccmp.natives.vehicle.getVehicleMaxBraking(handle);
      case "fTractionCurveMax":
      case "fTractionCurveMin":
        return ccmp.natives.vehicle.getVehicleMaxTraction(handle);
      default:
        return this._getDefaultHandlingValue(field);
    }
  }

  private _getDefaultHandlingValue(field: string): number {
    switch (field) {
      case "nInitialDriveGears":
        return 0;
      case "fInitialDriveForce":
      case "fDriveInertia":
      case "fClutchChangeRateScaleUpShift":
      case "fClutchChangeRateScaleDownShift":
      case "fBrakeForce":
      case "fTractionCurveMax":
      case "fTractionCurveMin":
        return 1;
      default:
        return 0;
    }
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
