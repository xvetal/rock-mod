import { type IPlayer } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPlayer as NativePlayer } from "@rock-sandbox/types/client";
import { BaseObjectType } from "../../../../shared";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxPlayer extends RockSandboxEntity implements IPlayer {
  public constructor(private readonly _nativePlayer: NativePlayer) {
    super();
  }

  public override get id(): number {
    return this._nativePlayer.id;
  }

  public override get remoteId(): number {
    return this._nativePlayer.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public override get isExists(): boolean {
    return this._nativePlayer.isExists;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativePlayer.position;
    return new Vector3D(x, -z, y);
  }

  public override getVariable(name: string): unknown {
    return this._nativePlayer.getNetData(name);
  }

  public override getSyncedMeta(key: string): unknown {
    return this._nativePlayer.getNetData(key);
  }

  public get name(): string {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.name");
  }

  public get health(): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.health");
  }

  public get armour(): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.armour");
  }

  public get isDead(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.isDead");
  }

  public get vehicle(): IVehicle | null {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.vehicle");
  }

  public get isVoice3DEnabled(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.isVoice3DEnabled");
  }

  public get voiceVolume(): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.voiceVolume");
  }

  public get isVoiceActive(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.isVoiceActive");
  }

  public setVoice3D(_enable: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setVoice3D");
  }

  public setVoiceVolume(_volume: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setVoiceVolume");
  }

  public get isReloading(): boolean {
    return this._nativePlayer.isReloading;
  }

  public get weapon(): number {
    return this._nativePlayer.weapon;
  }

  public getAmmoInClip(weapon: number): number {
    return this._nativePlayer.getAmmoInClip(weapon);
  }

  public getWeaponAmmo(_weapon: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.getWeaponAmmo");
  }

  public getBoneIndex(_boneId: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.getBoneIndex");
  }

  public setDecoration(_collection: string, _overlay: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setDecoration");
  }

  public removeDecoration(_collection: string, _overlay: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.removeDecoration");
  }

  public clearDecorations(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.clearDecorations");
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
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setHeadBlendData");
  }

  public setFaceFeature(_index: number, _value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setFaceFeature");
  }

  public setHeadOverlay(
    _overlayId: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setHeadOverlay");
  }

  public setHeadOverlayColor(
    _overlayId: number,
    _colorTypeId: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setHeadOverlayColor");
  }

  public setEyeColor(_eyeColor: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setEyeColor");
  }

  public setHairColor(_colorId: number, _highlightColorId: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setHairColor");
  }

  public setComponentVariation(
    _componentId: number,
    _drawableId: number,
    _textureId: number,
    _paletteId: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setComponentVariation");
  }

  public setPropertyVariation(_componentId: number, _drawableId: number, _textureId: number, _attach: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setPropertyVariation");
  }

  public clearProp(_componentId: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.clearProp");
  }

  public get isLocalPlayer(): boolean {
    return this._nativePlayer.isLocalPlayer;
  }

  public taskSwapWeapon(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.taskSwapWeapon");
  }

  public taskEnterVehicle(
    _vehicleHandle: number,
    _timeout: number,
    _seat: number,
    _speed: number,
    _flag: number,
    _p6: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.taskEnterVehicle");
  }

  public clearTasks(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.clearTasks");
  }

  public clearTasksImmediately(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.clearTasksImmediately");
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
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.taskPlayAnim");
  }

  public stopAnim(_dictionary: string, _name: string, _blendOutSpeed: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.stopAnim");
  }

  public setMovementClipset(_clipset: string, _speed: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setMovementClipset");
  }

  public resetMovementClipset(_blendDuration: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.resetMovementClipset");
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._nativePlayer.getBoneCoords(boneId, offsetX, offsetZ, -offsetY);
    return new Vector3D(x, -z, y);
  }

  public setNoCollision(_otherHandle: number, _thisFrameOnly: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.setNoCollision");
  }
}

const wrappers = new WeakMap<NativePlayer, RockSandboxPlayer>();
export function wrapPlayer(player: NativePlayer): RockSandboxPlayer {
  const old = wrappers.get(player);
  if (old) return old;
  const wrapper = new RockSandboxPlayer(player);
  wrappers.set(player, wrapper);
  return wrapper;
}
