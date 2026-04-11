import { type IEntity, type IEntityOptions } from "../entity";
import { type IVector3D } from "@shared/common/utils";

export interface IPedOptions extends IEntityOptions {}

export interface IRockModPed extends IEntity {
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
  setHeadOverlay(overlayId: number, index: number, opacity: number): void;
  setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void;
  setEyeColor(eyeColor: number): void;
  setHairColor(colorId: number, highlightColorId: number): void;
  setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void;
  setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void;
  clearProp(componentId: number): void;

  getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D;
}
