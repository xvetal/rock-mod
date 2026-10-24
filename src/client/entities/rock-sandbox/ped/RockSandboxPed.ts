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

  public override get remoteId(): number {
    return this._nativePed.id;
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

  public setDecoration(_collection: string, _overlay: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setDecoration");
  }

  public removeDecoration(_collection: string, _overlay: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.removeDecoration");
  }

  public clearDecorations(): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.clearDecorations");
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
    return rockSandboxNotImplemented("client", "RockSandboxPed.setHeadBlendData");
  }

  public setFaceFeature(_index: number, _value: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setFaceFeature");
  }

  public setHeadOverlay(_overlayId: number, _index: number, _opacity: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setHeadOverlay");
  }

  public setHeadOverlayColor(
    _overlayId: number,
    _colorTypeId: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setHeadOverlayColor");
  }

  public setEyeColor(_eyeColor: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setEyeColor");
  }

  public setHairColor(_colorId: number, _highlightColorId: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setHairColor");
  }

  public setComponentVariation(
    _componentId: number,
    _drawableId: number,
    _textureId: number,
    _paletteId: number,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setComponentVariation");
  }

  public setPropertyVariation(_componentId: number, _drawableId: number, _textureId: number, _attach: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.setPropertyVariation");
  }

  public clearProp(_componentId: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxPed.clearProp");
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._nativePed.getBoneCoords(boneId, offsetX, offsetZ, -offsetY);
    return new Vector3D(x, -z, y);
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
