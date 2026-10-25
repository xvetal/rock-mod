import { type IPlayer } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle";
import { type IVector3D } from "../../../../shared/common/utils";
import { wrapVehicle } from "../vehicle/RockSandboxVehicle";
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

  public override get handle(): number {
    return this._nativePlayer.handle;
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

  public override setPosition(value: IVector3D): void {
    this._nativePlayer.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setHeading(heading: number): void {
    this._nativePlayer.setHeading(heading);
  }

  public override getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._nativePlayer.getOffsetFromInWorldCoords(offsetX, offsetZ, -offsetY);
    return new Vector3D(x, -z, y);
  }

  public override get dimension(): number {
    return this._nativePlayer.dimension;
  }

  public override get heading(): number {
    return this._nativePlayer.heading;
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativePlayer.rotation;
    return new Vector3D(x, -z, y);
  }

  public override get forwardVector(): IVector3D {
    const { x, y, z } = this._nativePlayer.forwardVector;
    return new Vector3D(x, -z, y);
  }

  public override getVariable(name: string): unknown {
    return this._nativePlayer.getNetData(name);
  }

  public override getSyncedMeta(key: string): unknown {
    return this._nativePlayer.getNetData(key);
  }

  public get name(): string {
    return this._nativePlayer.name;
  }

  public override get model(): number {
    return this._nativePlayer.modelHash;
  }

  public get health(): number {
    return this._nativePlayer.health;
  }

  public override get alpha(): number {
    return this._nativePlayer.alpha;
  }

  public override setAlpha(alpha: number): void {
    this._nativePlayer.setAlpha(alpha);
  }

  public override resetAlpha(): void {
    this._nativePlayer.resetAlpha();
  }

  public override setVisible(visible: boolean): void {
    this._nativePlayer.setVisible(visible);
  }

  public get armour(): number {
    return this._nativePlayer.armour;
  }

  public get isDead(): boolean {
    return this._nativePlayer.isDead;
  }

  public get vehicle(): IVehicle | null {
    const vehicle = this._nativePlayer.vehicle;
    return vehicle === null ? null : wrapVehicle(vehicle);
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

  public getWeaponAmmo(weapon: number): number {
    return this._nativePlayer.getWeaponAmmo(weapon);
  }

  public getBoneIndex(_boneId: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxPlayer.getBoneIndex");
  }

  public setDecoration(collection: string, overlay: string): void {
    this._nativePlayer.setDecoration(collection, overlay);
  }

  public removeDecoration(collection: string, overlay: string): void {
    this._nativePlayer.removeDecoration(collection, overlay);
  }

  public clearDecorations(): void {
    this._nativePlayer.clearDecorations();
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
    this._nativePlayer.setHeadBlendData(
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
    this._nativePlayer.setFaceFeature(index, value);
  }

  public setHeadOverlay(
    overlayId: number,
    index: number,
    opacity: number,
    firstColor: number,
    secondColor: number,
  ): void {
    this._nativePlayer.setHeadOverlay(overlayId, index, opacity, firstColor, secondColor);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this._nativePlayer.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this._nativePlayer.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this._nativePlayer.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this._nativePlayer.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this._nativePlayer.setPropertyVariation(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this._nativePlayer.clearProp(componentId);
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

  public setNoCollision(otherHandle: number, thisFrameOnly: boolean): void {
    this._nativePlayer.setNoCollision(otherHandle, thisFrameOnly);
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
