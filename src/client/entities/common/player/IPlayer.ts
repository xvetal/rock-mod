import { type IEntity, type IEntityOptions } from "../entity";
import { type IVehicle } from "../vehicle";
import { type IVector3D } from "@shared/common/utils";

export interface IPlayerOptions extends IEntityOptions {}

export interface IPlayer extends IEntity {
  get name(): string;
  get health(): number;
  get armour(): number;
  get isDead(): boolean;
  get vehicle(): IVehicle | null;

  get isVoice3DEnabled(): boolean;
  get voiceVolume(): number;
  get isVoiceActive(): boolean;
  setVoice3D(enable: boolean): void;
  setVoiceVolume(volume: number): void;

  get isReloading(): boolean;
  get weapon(): number;
  getAmmoInClip(weapon: number): number;
  getWeaponAmmo(weapon: number): number;

  getBoneIndex(boneId: number): number;

  setDecoration(collection: string, overlay: string): void;
  removeDecoration(collection: string, overlay: string): void;
  clearDecorations(): void;

  setHeadBlendData(
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
  ): void;
  setFaceFeature(index: number, value: number): void;
  setHeadOverlay(overlayId: number, index: number, opacity: number, firstColor: number, secondColor: number): void;
  setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void;
  setEyeColor(eyeColor: number): void;
  setHairColor(colorId: number, highlightColorId: number): void;
  setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void;
  setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void;
  clearProp(componentId: number): void;

  get isLocalPlayer(): boolean;

  taskSwapWeapon(): void;
  taskEnterVehicle(vehicleHandle: number, timeout: number, seat: number, speed: number, flag: number, p6: number): void;
  clearTasks(): void;
  clearTasksImmediately(): void;
  taskPlayAnim(
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
  ): void;
  stopAnim(dictionary: string, name: string, blendOutSpeed: number): void;

  setMovementClipset(clipset: string, speed: number): void;
  resetMovementClipset(blendDuration: number): void;

  getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D;

  setNoCollision(otherHandle: number, thisFrameOnly: boolean): void;
}
