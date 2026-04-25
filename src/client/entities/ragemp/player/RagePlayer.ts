import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type IPlayer } from "@RockMod/client/entities";
import { type RageVehicle } from "@RockMod/client/entities/ragemp/vehicle/RageVehicle";
import { RockMod } from "@RockMod/client/RockMod";
import { type IVector3D, Vector3D } from "@shared/common/utils";

interface IRagePlayerOptions extends IRageEntityOptions<PlayerMp> {}

export class RagePlayer extends RageEntity<PlayerMp> implements IPlayer {
  public get name(): string {
    return this.mpEntity.name;
  }

  public get health(): number {
    return this.mpEntity.health;
  }

  public get armour(): number {
    return this.mpEntity.armour;
  }

  public get isDead(): boolean {
    return this.mpEntity.health <= 0;
  }

  public constructor(options: IRagePlayerOptions) {
    super(options);
  }

  public get vehicle(): RageVehicle | null {
    const vehicle = this.mpEntity.vehicle;

    if (!vehicle) {
      return null;
    }

    return RockMod.instance.vehicles.getByID(vehicle.id) as RageVehicle;
  }

  public get isVoice3DEnabled(): boolean {
    return Boolean(this.mpEntity.voice3d);
  }

  public get voiceVolume(): number {
    return this.mpEntity.voiceVolume;
  }

  public get isVoiceActive(): boolean {
    return this.mpEntity.isVoiceActive;
  }

  public setVoice3D(enable: boolean): void {
    this.mpEntity.voice3d = enable;
  }

  public setVoiceVolume(volume: number): void {
    this.mpEntity.voiceVolume = volume;
  }

  public get isReloading(): boolean {
    return this.mpEntity.isReloading();
  }

  public get weapon(): number {
    return this.mpEntity.weapon;
  }

  public getAmmoInClip(weapon: number): number {
    return this.mpEntity.getAmmoInClip(weapon);
  }

  public getWeaponAmmo(weapon: number): number {
    return mp.game.weapon.getAmmoInPed(this.mpEntity.handle, weapon);
  }

  public getBoneIndex(boneId: number): number {
    return this.mpEntity.getBoneIndex(boneId);
  }

  public setDecoration(collection: string, overlay: string): void {
    const collectionHash = mp.game.joaat(collection);
    const overlayHash = mp.game.joaat(overlay);

    this.mpEntity.setDecoration(collectionHash, overlayHash);
  }

  public removeDecoration(collection: string, overlay: string): void {
    const collectionHash = mp.game.joaat(collection);
    const overlayHash = mp.game.joaat(overlay);

    // @ts-expect-error TODO test if this works
    this.mpEntity.removeDecoration(collectionHash, overlayHash);
  }

  public clearDecorations(): void {
    this.mpEntity.clearDecorations();
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
    this.mpEntity.setHeadBlendData(
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
    this.mpEntity.setFaceFeature(index, value);
  }

  public setHeadOverlay(
    overlayId: number,
    index: number,
    opacity: number,
    firstColor: number,
    secondColor: number,
  ): void {
    this.mpEntity.setHeadOverlay(overlayId, index, opacity, firstColor, secondColor);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this.mpEntity.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this.mpEntity.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this.mpEntity.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this.mpEntity.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this.mpEntity.setPropIndex(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this.mpEntity.clearProp(componentId);
  }

  public get isLocalPlayer(): boolean {
    return mp.players.local.id === this.mpEntity.id;
  }

  public clearTasks(): void {
    this.mpEntity.clearTasks();
  }

  public resetMovementClipset(blendDuration: number): void {
    this.mpEntity.resetMovementClipset(blendDuration);
  }

  public setMovementClipset(clipset: string, speed: number): void {
    this.mpEntity.setMovementClipset(clipset, speed);
  }

  public taskEnterVehicle(
    vehicleHandle: number,
    timeout: number,
    seat: number,
    speed: number,
    flag: number,
    p6: number,
  ): void {
    this.mpEntity.taskEnterVehicle(vehicleHandle, timeout, seat, speed, flag, p6);
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
    this.mpEntity.taskPlayAnim(
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

  public taskSwapWeapon(): void {
    this.mpEntity.taskSwapWeapon(true);
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this.mpEntity.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }
}
