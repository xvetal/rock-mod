import { type IPed } from "../../common/ped/IPed";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxPed extends RockSandboxEntity implements IPed {
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

  public getBoneCoords(_boneId: number, _offsetX: number, _offsetY: number, _offsetZ: number): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxPed.getBoneCoords");
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
