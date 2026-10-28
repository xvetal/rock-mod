import { type IPed } from "../../common/ped/IPed";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPed as NativePed } from "@rock-sandbox/types/client";
import { BaseObjectType } from "../../../../shared";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxPed extends RockSandboxEntity implements IPed {
  public constructor(private readonly _nativePed: NativePed) {
    super();
  }

  public override get id(): number {
    return this._nativePed.id;
  }

  public override get remoteId(): number | null {
    return this._nativePed.remoteId;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public override get isExists(): boolean {
    return this._nativePed.isExists;
  }

  public override get model(): number {
    return this._nativePed.modelHash;
  }

  public override get dimension(): number {
    return this._nativePed.dimension;
  }

  public override get heading(): number {
    return this._nativePed.rotation.y;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativePed.position;
    return new Vector3D(x, -z, y);
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativePed.rotation;
    return new Vector3D(x, -z, y);
  }

  public override get handle(): number {
    return this._nativePed.handle;
  }

  public override get alpha(): number {
    return this._nativePed.alpha;
  }

  public override setModel(value: string): void {
    this._nativePed.setModel(value);
  }

  public override setPosition(value: IVector3D): void {
    this._nativePed.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setRotation(value: IVector3D): void {
    this._nativePed.setRotation({ x: value.x, y: value.z, z: -value.y });
  }

  public override setHeading(value: number): void {
    this._nativePed.setHeading(value);
  }

  public override setDimension(value: number): void {
    this._nativePed.setDimension(value);
  }

  public override setVisible(value: boolean): void {
    this._nativePed.setVisible(value);
  }

  public override setAlpha(value: number): void {
    this._nativePed.setAlpha(value);
  }

  public override resetAlpha(): void {
    this._nativePed.setAlpha(255);
  }

  public override destroy(): void {
    this._nativePed.destroy();
  }

  public setDecoration(collection: string, overlay: string): void {
    this._nativePed.setDecoration(collection, overlay);
  }

  public removeDecoration(collection: string, overlay: string): void {
    this._nativePed.removeDecoration(collection, overlay);
  }

  public clearDecorations(): void {
    this._nativePed.clearDecorations();
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
    this._nativePed.setHeadBlendData(
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
    this._nativePed.setFaceFeature(index, value);
  }

  public setHeadOverlay(overlayId: number, index: number, opacity: number): void {
    this._nativePed.setHeadOverlay(overlayId, index, opacity);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this._nativePed.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this._nativePed.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this._nativePed.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this._nativePed.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this._nativePed.setPropertyVariation(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this._nativePed.clearProp(componentId);
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._nativePed.getBoneCoords(boneId, offsetX, offsetZ, -offsetY);
    return new Vector3D(x, -z, y);
  }

  public tryGetBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D | null {
    const point = this._nativePed.tryGetBoneCoords(boneId, offsetX, offsetZ, -offsetY);
    return point ? new Vector3D(point.x, -point.z, point.y) : null;
  }

  public clearTasks(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.clearTasks");
  }

  public taskPlayAnim(
    _dictionary: string,
    _name: string,
    _blendInSpeed: number,
    _blendOutSpeed: number,
    _duration: number,
    _flag: number,
    _playbackRate: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.taskPlayAnim");
  }

  public taskGoToCoordAnyMeans(
    _x: number,
    _y: number,
    _z: number,
    _speed: number,
    _walkingStyle?: number,
    _drivingFlags?: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.taskGoToCoordAnyMeans");
  }

  public stopAnim(_dictionary: string, _name: string, _blendOutSpeed: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.stopAnim");
  }

  public setBlockingOfNonTemporaryEvents(_blocking: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setBlockingOfNonTemporaryEvents");
  }
}

const wrappers = new WeakMap<NativePed, RockSandboxPed>();
export function wrapPed(ped: NativePed): RockSandboxPed {
  const old = wrappers.get(ped);
  if (old) return old;
  const wrapper = new RockSandboxPed(ped);
  wrappers.set(ped, wrapper);
  return wrapper;
}
