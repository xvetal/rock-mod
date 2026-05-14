import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type IPed } from "../../common";
import { type IVector3D, Vector3D } from "@shared/common/utils";

export interface IRagePedOptions extends IRageEntityOptions<PedMp> {}

export class RagePed extends RageEntity<PedMp> implements IPed {
  public constructor(options: IRagePedOptions) {
    super(options);
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

  public setHeadOverlay(overlayId: number, index: number, opacity: number): void {
    this.mpEntity.setHeadOverlay(overlayId, index, opacity);
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

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this.mpEntity.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public clearTasks(): void {
    this.mpEntity.clearTasks();
  }

  public taskPlayAnim(
    dictionary: string,
    name: string,
    blendInSpeed: number,
    blendOutSpeed: number,
    duration: number,
    flag: number,
    playbackRate: number,
  ): void {
    this.mpEntity.taskPlayAnim(
      dictionary,
      name,
      blendInSpeed,
      blendOutSpeed,
      duration,
      flag,
      playbackRate,
      false,
      false,
      false,
    );
  }

  public stopAnim(dictionary: string, name: string, blendOutSpeed: number): void {
    mp.game.task.stopAnimTask(this.handle, dictionary, name, blendOutSpeed);
  }
}
