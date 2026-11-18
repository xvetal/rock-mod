/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Player as VimpPlayer } from "@vimp-mp/types/client";
import { RockMod } from "@RockMod/client/RockMod";
import { BaseObjectType } from "@shared/entities";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IPlayer } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVector3D, Vector3D } from "@shared/common/utils";

const ZERO_VECTOR: IVector3D = new Vector3D(0, 0, 0);
const PED_HEALTH_OFFSET = 100;
const CLIPSET_LOAD_POLL_MS = 50;
const CLIPSET_LOAD_TIMEOUT_MS = 5000;

export interface IVIMPPlayerOptions {
  /** Network id of the player (same as remoteId — VIMP exposes only one id). */
  readonly id: number;
  /** Human-readable name from the handshake. May be empty if not yet known. */
  readonly name: string;
  /** `true` if this Player represents the local user, `false` for remotes. */
  readonly isLocal: boolean;
}

/**
 * VIMP implementation of the Rock-Mod player facade.
 *
 * Identity and synced meta are tracked by id. Runtime entity operations are
 * delegated to `vimp.players.getById(id)`, whose `handle` is live for the
 * local player and for streamed remote players. Missing remote handles degrade
 * to safe defaults/no-ops, matching RageMP-style best-effort client behavior.
 */
export class VIMPPlayer implements IPlayer {
  /** Глобальный set для one-time warnings, чтобы не флудить лог. */
  private static readonly _warnedMethods = new Set<string>();

  /** Pending and applied clipsets share the same native streaming request. */
  private static readonly _movementClipsetRefs = new Map<string, number>();

  private readonly _id: number;

  private _name: string;

  private readonly _isLocal: boolean;

  private _isExists: boolean;

  /** Compatibility state; VIMP selects spatialization from the active voice route. */
  private _isVoice3DEnabled = true;

  private _pendingMovementClipset: { name: string } | null = null;

  private _activeMovementClipset: string | null = null;

  public constructor(options: IVIMPPlayerOptions) {
    this._id = options.id;
    this._name = options.name;
    this._isLocal = options.isLocal;
    this._isExists = true;
  }

  /** Помечает игрока как удалённого — вызывается из `VIMPPlayersManager`. */
  public markRemoved(): void {
    this._isExists = false;
    this.releaseMovementClipsets();
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
    return this._getNativePlayer()?.model ?? 0;
  }

  public get heading(): number {
    return this._getNativePlayer()?.heading ?? 0;
  }

  public setHeading(heading: number): void {
    this._getNativePlayer()?.setHeading(heading);
  }

  public setModel(value: string): void {
    this._getNativePlayer()?.setModel(value);
  }

  public get rotation(): IVector3D {
    const rotation = this._getNativePlayer()?.rotation;
    return rotation ? new Vector3D(rotation.x, rotation.y, rotation.z) : ZERO_VECTOR;
  }

  public setRotation(value: IVector3D): void {
    this._getNativePlayer()?.setRotation(value);
  }

  public get forwardVector(): IVector3D {
    const vector = this._getNativePlayer()?.forwardVector;
    return vector ? new Vector3D(vector.x, vector.y, vector.z) : ZERO_VECTOR;
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
    const position = this._getNativePlayer()?.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return position ? new Vector3D(position.x, position.y, position.z) : ZERO_VECTOR;
  }

  public getBoneIndexByName(boneName: string): number {
    return this._getNativePlayer()?.getBoneIndexByName(boneName) ?? -1;
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const position = this._getNativePlayer()?.getWorldPositionOfBone(boneIndex);
    return position ? new Vector3D(position.x, position.y, position.z) : ZERO_VECTOR;
  }

  public getVariable(name: string): unknown | null {
    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Player, this._id, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Player, this._id, key);
  }

  public hasSyncedMeta(key: string): boolean {
    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Player, this._id, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Player, this._id);
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
    this._getNativePlayer()?.attachToEntity(
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
    this._getNativePlayer()?.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._getNativePlayer()?.getSpeed() ?? 0;
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._getNativePlayer()?.isPlayingAnim(dictionary, name, taskFlag) ?? false;
  }

  // -- IPlayer --------------------------------------------------------------

  public get name(): string {
    return this._name;
  }

  public get health(): number {
    const handle = this._getHandle();
    if (!handle) return 100;
    // GTA ped health is offset by 100 (200 = full); the facade uses the same 0-100 scale as RageMP and the server.
    return Math.max(0, vimp.natives.entity.getEntityHealth(handle) - PED_HEALTH_OFFSET);
  }

  public get armour(): number {
    const handle = this._getHandle();
    return handle ? vimp.natives.ped.getPedArmour(handle) : 0;
  }

  public get isDead(): boolean {
    const handle = this._getHandle();
    if (!handle) return false;
    return vimp.natives.entity.isEntityDead(handle, false);
  }

  public get vehicle(): IVehicle | null {
    // VIMP keeps its own handle -> Vehicle index and returns null until the
    // player is fully seated: entry animation, not streamed or on foot give null.
    const vimpVehicle = this._getNativePlayer()?.vehicle;
    if (!vimpVehicle) return null;

    return RockMod.instance.vehicles.findByID(vimpVehicle.id);
  }

  public get isVoice3DEnabled(): boolean {
    return this._isVoice3DEnabled;
  }

  public get voiceVolume(): number {
    return vimp.voice.getPlayerVolume(this._id);
  }

  public get isVoiceActive(): boolean {
    return this._getNativePlayer()?.isTalking ?? false;
  }

  public setVoice3D(enable: boolean): void {
    // VIMP applies spatialization from the server-selected proximity/channel
    // route. Keep the requested value for Rock-Mod API compatibility.
    this._isVoice3DEnabled = enable;
  }

  public setVoiceVolume(volume: number): void {
    vimp.voice.setPlayerVolume(this._id, Math.max(0, Math.min(2, volume)));
  }

  public get isReloading(): boolean {
    const handle = this._getHandle();
    return handle ? vimp.natives.ped.isPedReloading(handle) : false;
  }

  public get weapon(): number {
    const handle = this._getHandle();
    return handle ? vimp.natives.weapon.getSelectedPedWeapon(handle) >>> 0 : 0;
  }

  public getAmmoInClip(weapon: number): number {
    const handle = this._getHandle();
    if (!handle) return 0;

    const { return: success, ammo } = vimp.natives.weapon.getAmmoInClip(handle, weapon);
    return success ? ammo : 0;
  }

  public getWeaponAmmo(weapon: number): number {
    const handle = this._getHandle();
    return handle ? vimp.natives.weapon.getAmmoInPedWeapon(handle, weapon) : 0;
  }

  public getBoneIndex(boneId: number): number {
    return this._getNativePlayer()?.getBoneIndex(boneId) ?? -1;
  }

  public setDecoration(collection: string, overlay: string): void {
    this._getNativePlayer()?.setDecoration(collection, overlay);
  }

  public removeDecoration(collection: string, overlay: string): void {
    this._getNativePlayer()?.removeDecoration(collection, overlay);
  }

  public clearDecorations(): void {
    this._getNativePlayer()?.clearDecorations();
  }

  public setHeadBlendData(
    shapeFirstId: number,
    shapeSecondId: number,
    shapeThirdId: number,
    skinFirstId: number,
    skinSecondId: number,
    skinThirdId: number,
    shapeMix: number,
    skinMix: number,
    thirdMix: number,
    isParent: boolean,
  ): void {
    this._getNativePlayer()?.setHeadBlendData(
      shapeFirstId,
      shapeSecondId,
      shapeThirdId,
      skinFirstId,
      skinSecondId,
      skinThirdId,
      shapeMix,
      skinMix,
      thirdMix,
      isParent,
    );
  }

  public setFaceFeature(index: number, value: number): void {
    this._getNativePlayer()?.setFaceFeature(index, value);
  }

  public setHeadOverlay(
    overlayId: number,
    index: number,
    opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    this._getNativePlayer()?.setHeadOverlay(overlayId, index, opacity);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this._getNativePlayer()?.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this._getNativePlayer()?.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this._getNativePlayer()?.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this._getNativePlayer()?.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this._getNativePlayer()?.setPropertyVariation(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this._getNativePlayer()?.clearProp(componentId);
  }

  public get isLocalPlayer(): boolean {
    return this._isLocal;
  }

  public taskSwapWeapon(): void {
    this._getNativePlayer()?.taskSwapWeapon(true);
  }

  public taskEnterVehicle(
    vehicleHandle: number,
    timeout: number,
    seat: number,
    speed: number,
    flag: number,
    _p6: number,
  ): void {
    this._getNativePlayer()?.taskEnterVehicle(vehicleHandle, timeout, seat, speed, flag);
  }

  public clearTasks(): void {
    this._getNativePlayer()?.clearTasks();
  }

  public clearTasksImmediately(): void {
    this._getNativePlayer()?.clearTasksImmediately();
  }

  public taskPlayAnim(
    dictionary: string,
    name: string,
    blendInSpeed: number,
    blendOutSpeed: number,
    duration: number,
    flag: number,
    playbackRate: number,
    lockX: boolean,
    lockY: boolean,
    lockZ: boolean,
  ): void {
    this._getNativePlayer()?.taskPlayAnim(
      dictionary,
      name,
      blendInSpeed,
      blendOutSpeed,
      duration,
      flag,
      playbackRate,
      lockX,
      lockY,
      lockZ,
    );
  }

  public stopAnim(dictionary: string, name: string, blendOutSpeed: number): void {
    this._getNativePlayer()?.stopAnim(dictionary, name, blendOutSpeed);
  }

  public setMovementClipset(clipset: string, speed: number): void {
    if (!this._isExists) return;
    if (!this._getHandle()) {
      this.releaseMovementClipsets();
      return;
    }

    const request = { name: clipset.toLowerCase() };
    if (this._pendingMovementClipset?.name !== request.name) {
      this._cancelMovementClipsetLoad();
      const refs = VIMPPlayer._movementClipsetRefs.get(request.name) ?? 0;
      if (refs === 0) {
        vimp.natives.streaming.requestClipSet(request.name);
      }
      VIMPPlayer._movementClipsetRefs.set(request.name, refs + 1);
    }
    this._pendingMovementClipset = request;
    const startedAt = Date.now();

    const apply = (): void => {
      if (this._pendingMovementClipset !== request) return;
      const handle = this._getHandle();
      if (!handle) {
        this.releaseMovementClipsets();
        return;
      }

      try {
        if (vimp.natives.streaming.hasClipSetLoaded(request.name)) {
          vimp.natives.ped.setPedMovementClipset(handle, request.name, speed);
          this._pendingMovementClipset = null;
          this._replaceActiveMovementClipset(request.name);
          return;
        }
        if (Date.now() - startedAt < CLIPSET_LOAD_TIMEOUT_MS) {
          setTimeout(apply, CLIPSET_LOAD_POLL_MS);
          return;
        }
      } catch (error) {
        this._cancelMovementClipsetLoad();
        throw error;
      }

      this._cancelMovementClipsetLoad();
    };
    apply();
  }

  public resetMovementClipset(blendDuration: number): void {
    this._cancelMovementClipsetLoad();
    const handle = this._getHandle();
    if (handle) {
      vimp.natives.ped.resetPedMovementClipset(handle, blendDuration);
    }
    this._replaceActiveMovementClipset(null);
  }

  /** Releases this player's clipsets when its ped leaves the stream. */
  public releaseMovementClipsets(): void {
    this._cancelMovementClipsetLoad();
    this._replaceActiveMovementClipset(null);
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const position = this._getNativePlayer()?.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return position ? new Vector3D(position.x, position.y, position.z) : ZERO_VECTOR;
  }

  public setNoCollision(otherHandle: number, thisFrameOnly: boolean): void {
    this._getNativePlayer()?.setNoCollision(otherHandle, thisFrameOnly);
  }

  public tryGetBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D | null {
    const point = this._getNativePlayer()?.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return point ? new Vector3D(point.x, point.y, point.z) : null;
  }

  private _cancelMovementClipsetLoad(): void {
    const pending = this._pendingMovementClipset;
    this._pendingMovementClipset = null;
    if (pending) {
      VIMPPlayer._releaseMovementClipset(pending.name);
    }
  }

  private _replaceActiveMovementClipset(clipset: string | null): void {
    const previous = this._activeMovementClipset;
    this._activeMovementClipset = clipset;
    if (previous !== null) {
      VIMPPlayer._releaseMovementClipset(previous);
    }
  }

  private static _releaseMovementClipset(clipset: string): void {
    const refs = VIMPPlayer._movementClipsetRefs.get(clipset) ?? 0;
    if (refs > 1) {
      VIMPPlayer._movementClipsetRefs.set(clipset, refs - 1);
    } else {
      VIMPPlayer._movementClipsetRefs.delete(clipset);
      vimp.natives.streaming.removeClipSet(clipset);
    }
  }

  private _getNativePlayer(): VimpPlayer | null {
    try {
      const player = vimp.players.getById(this._id);
      if (player) {
        return player;
      }

      const localPlayer = vimp.players.local;
      return localPlayer?.id === this._id ? localPlayer : null;
    } catch {
      return null;
    }
  }

  /** GTA handle of the streamed ped, or 0 when the player is not streamed in. */
  private _getHandle(): number {
    return this._getNativePlayer()?.handle ?? 0;
  }

  private _warnOnce(method: string): void {
    if (VIMPPlayer._warnedMethods.has(method)) {
      return;
    }
    VIMPPlayer._warnedMethods.add(method);
    console.warn(
      `[VIMPPlayer] ${method}() пока не реализован для VIMP — вызов проигнорирован ` +
        `(следующие вызовы этого метода будут проигнорированы молча).`,
    );
  }
}
