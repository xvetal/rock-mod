/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Player as CcmpPlayer } from "@classic-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IPlayer } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVector3D, Vector3D } from "@shared/common/utils";

const ZERO_VECTOR: IVector3D = new Vector3D(0, 0, 0);

export interface ICCMPPlayerOptions {
  /** Network id of the player (same as remoteId — CCMP exposes only one id). */
  readonly id: number;
  /** Human-readable name from the handshake. May be empty if not yet known. */
  readonly name: string;
  /** `true` if this Player represents the local user, `false` for remotes. */
  readonly isLocal: boolean;
}

/**
 * CCMP implementation of the Rock-Mod player facade.
 *
 * Identity and synced meta are tracked by id. Runtime entity operations are
 * delegated to `ccmp.players.getById(id)`, whose `handle` is live for the
 * local player and for streamed remote players. Missing remote handles degrade
 * to safe defaults/no-ops, matching RageMP-style best-effort client behavior.
 */
export class CCMPPlayer implements IPlayer {
  /** Глобальный set для one-time warnings, чтобы не флудить лог. */
  private static readonly _warnedMethods = new Set<string>();

  private readonly _id: number;

  private _name: string;

  private readonly _isLocal: boolean;

  private _isExists: boolean;

  public constructor(options: ICCMPPlayerOptions) {
    this._id = options.id;
    this._name = options.name;
    this._isLocal = options.isLocal;
    this._isExists = true;
  }

  /** Помечает игрока как удалённого — вызывается из `CCMPPlayersManager`. */
  public markRemoved(): void {
    this._isExists = false;
  }

  /** Обновляет name (полезно если name приехал позже первого создания). */
  public setNameInternal(name: string): void {
    if (name) {
      this._name = name;
    }
  }

  // -- IBaseObject ----------------------------------------------------------

  public get id(): number {
    return this._id;
  }

  public get remoteId(): number {
    return this._id;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public get isExists(): boolean {
    return this._isExists;
  }

  public get handle(): number {
    return this._getNativePlayer()?.handle ?? 0;
  }

  public destroy(): void {
    this._warnOnce("destroy");
  }

  // -- IWorldObject ---------------------------------------------------------

  public get position(): IVector3D {
    const position = this._getNativePlayer()?.position;
    return position ? new Vector3D(position.x, position.y, position.z) : ZERO_VECTOR;
  }

  public get dimension(): number {
    return 0;
  }

  public setPosition(value: IVector3D): void {
    this._getNativePlayer()?.setPosition(value);
  }

  public setDimension(_value: number): void {
    this._warnOnce("setDimension");
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
    this._getNativePlayer()?.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  // -- IEntity --------------------------------------------------------------

  public get model(): number {
    return this._withHandle(0, (handle) => ccmp.natives.entity.getEntityModel(handle));
  }

  public get heading(): number {
    return this._getNativePlayer()?.heading ?? 0;
  }

  public setHeading(heading: number): void {
    this._getNativePlayer()?.setHeading(heading);
  }

  public setModel(_value: string): void {
    this._warnOnce("setModel");
  }

  public get rotation(): IVector3D {
    return this._withHandle(ZERO_VECTOR, (handle) => {
      const rotation = ccmp.natives.entity.getEntityRotation(handle, 2);
      return new Vector3D(rotation.x, rotation.y, rotation.z);
    });
  }

  public setRotation(value: IVector3D): void {
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.setEntityRotation(handle, value.x, value.y, value.z, 2, true);
    });
  }

  public get forwardVector(): IVector3D {
    return this._withHandle(ZERO_VECTOR, (handle) => {
      const vector = ccmp.natives.entity.getEntityForwardVector(handle);
      return new Vector3D(vector.x, vector.y, vector.z);
    });
  }

  public freezePosition(freeze: boolean): void {
    this._getNativePlayer()?.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._getNativePlayer()?.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._getNativePlayer()?.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._getNativePlayer()?.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._getNativePlayer()?.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._getNativePlayer()?.alpha ?? 255;
  }

  public resetAlpha(): void {
    this._getNativePlayer()?.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    return this._withHandle(ZERO_VECTOR, (handle) => {
      const position = ccmp.natives.entity.getOffsetFromEntityInWorldCoords(handle, offsetX, offsetY, offsetZ);
      return new Vector3D(position.x, position.y, position.z);
    });
  }

  public getBoneIndexByName(boneName: string): number {
    return this._withHandle(-1, (handle) => ccmp.natives.entity.getEntityBoneIndexByName(handle, boneName));
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    return this._withHandle(ZERO_VECTOR, (handle) => {
      const position = ccmp.natives.entity.getWorldPositionOfEntityBone(handle, boneIndex);
      return new Vector3D(position.x, position.y, position.z);
    });
  }

  public getVariable(name: string): unknown | null {
    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Player, this._id, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Player, this._id, key);
  }

  public hasSyncedMeta(key: string): boolean {
    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Player, this._id, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Player, this._id);
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
    this._withHandleVoid((handle) => {
      ccmp.natives.entity.attachEntityToEntity(
        handle,
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

  // -- IPlayer --------------------------------------------------------------

  public get name(): string {
    return this._name;
  }

  public get health(): number {
    return 100;
  }

  public get armour(): number {
    return 0;
  }

  public get isDead(): boolean {
    return false;
  }

  public get vehicle(): IVehicle | null {
    return null;
  }

  public get isVoice3DEnabled(): boolean {
    return false;
  }

  public get voiceVolume(): number {
    return 0;
  }

  public get isVoiceActive(): boolean {
    return false;
  }

  public setVoice3D(_enable: boolean): void {
    this._warnOnce("setVoice3D");
  }

  public setVoiceVolume(_volume: number): void {
    this._warnOnce("setVoiceVolume");
  }

  public get isReloading(): boolean {
    return false;
  }

  public get weapon(): number {
    return 0;
  }

  public getAmmoInClip(_weapon: number): number {
    return 0;
  }

  public getWeaponAmmo(_weapon: number): number {
    return 0;
  }

  public getBoneIndex(boneId: number): number {
    return this._withHandle(-1, (handle) => ccmp.natives.ped.getPedBoneIndex(handle, boneId));
  }

  public setDecoration(_collection: string, _overlay: string): void {
    this._warnOnce("setDecoration");
  }

  public removeDecoration(_collection: string, _overlay: string): void {
    this._warnOnce("removeDecoration");
  }

  public clearDecorations(): void {
    this._warnOnce("clearDecorations");
  }

  public setHeadBlendData(
    _shapeFirstId: number,
    _shapeSecondId: number,
    _shapeThirdId: number,
    _skinFirstId: number,
    _skinSecondId: number,
    _skinThirdId: number,
    _shapeMix: number,
    _skinMix: number,
    _thirdMix: number,
    _isParent: boolean,
  ): void {
    this._warnOnce("setHeadBlendData");
  }

  public setFaceFeature(_index: number, _value: number): void {
    this._warnOnce("setFaceFeature");
  }

  public setHeadOverlay(
    _overlayId: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    this._warnOnce("setHeadOverlay");
  }

  public setHeadOverlayColor(
    _overlayId: number,
    _colorTypeId: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    this._warnOnce("setHeadOverlayColor");
  }

  public setEyeColor(_eyeColor: number): void {
    this._warnOnce("setEyeColor");
  }

  public setHairColor(_colorId: number, _highlightColorId: number): void {
    this._warnOnce("setHairColor");
  }

  public setComponentVariation(
    _componentId: number,
    _drawableId: number,
    _textureId: number,
    _paletteId: number,
  ): void {
    this._warnOnce("setComponentVariation");
  }

  public setPropertyVariation(_componentId: number, _drawableId: number, _textureId: number, _attach: boolean): void {
    this._warnOnce("setPropertyVariation");
  }

  public clearProp(_componentId: number): void {
    this._warnOnce("clearProp");
  }

  public get isLocalPlayer(): boolean {
    return this._isLocal;
  }

  public taskSwapWeapon(): void {
    this._warnOnce("taskSwapWeapon");
  }

  public taskEnterVehicle(
    _vehicleHandle: number,
    _timeout: number,
    _seat: number,
    _speed: number,
    _flag: number,
    _p6: number,
  ): void {
    this._warnOnce("taskEnterVehicle");
  }

  public clearTasks(): void {
    this._warnOnce("clearTasks");
  }

  public clearTasksImmediately(): void {
    this._warnOnce("clearTasksImmediately");
  }

  public taskPlayAnim(
    _dictionary: string,
    _name: string,
    _blendInSpeed: number,
    _blendOutSpeed: number,
    _duration: number,
    _flag: number,
    _playbackRate: number,
    _lockX: boolean,
    _lockY: boolean,
    _lockZ: boolean,
  ): void {
    this._warnOnce("taskPlayAnim");
  }

  public stopAnim(_dictionary: string, _name: string, _blendOutSpeed: number): void {
    this._warnOnce("stopAnim");
  }

  public setMovementClipset(_clipset: string, _speed: number): void {
    this._warnOnce("setMovementClipset");
  }

  public resetMovementClipset(_blendDuration: number): void {
    this._warnOnce("resetMovementClipset");
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    return this._withHandle(ZERO_VECTOR, (handle) => {
      const position = ccmp.natives.ped.getPedBoneCoords(handle, boneId, offsetX, offsetY, offsetZ);
      return new Vector3D(position.x, position.y, position.z);
    });
  }

  public setNoCollision(otherHandle: number, thisFrameOnly: boolean): void {
    this._withHandleVoid((handle) => {
      if (otherHandle !== 0) {
        ccmp.natives.entity.setEntityNoCollisionEntity(handle, otherHandle, thisFrameOnly);
      }
    });
  }

  private _getNativePlayer(): CcmpPlayer | null {
    try {
      const player = ccmp.players.getById(this._id) as CcmpPlayer | null;
      if (player) {
        return player;
      }

      const localPlayer = ccmp.players.local as CcmpPlayer | null;
      return localPlayer?.id === this._id ? localPlayer : null;
    } catch {
      return null;
    }
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

  private _warnOnce(method: string): void {
    if (CCMPPlayer._warnedMethods.has(method)) {
      return;
    }
    CCMPPlayer._warnedMethods.add(method);
    console.warn(
      `[CCMPPlayer] ${method}() пока не реализован для CCMP — вызов проигнорирован ` +
        `(следующие вызовы этого метода будут проигнорированы молча).`,
    );
  }
}
