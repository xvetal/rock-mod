import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type Ped as VimpPed } from "@vimp-mp/types/client";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IPed } from "../../common/ped/IPed";

export class VIMPPed implements IPed {
  private _destroyed = false;

  public constructor(
    private readonly _vimpPed: VimpPed,
    private readonly _onDestroy: (ped: VIMPPed) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpPed.id;
  }

  public get remoteId(): number | null {
    return this._vimpPed.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._vimpPed.isAlive;
  }

  public get handle(): number {
    return this._vimpPed.handle;
  }

  public destroy(): void {
    if (this._destroyed) {
      return;
    }

    this._destroyed = true;
    this._vimpPed.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpPed.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpPed.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._vimpPed.setPosition(value);
  }

  public setDimension(value: number): void {
    this._vimpPed.setDimension(value);
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
    this._vimpPed.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._vimpPed.model;
  }

  public get heading(): number {
    return this._vimpPed.heading;
  }

  public setHeading(heading: number): void {
    this._vimpPed.setHeading(heading);
  }

  public setModel(value: string): void {
    this._vimpPed.setModel(value);
  }

  public get rotation(): Vector3D {
    return new Vector3D(0, 0, this._vimpPed.heading);
  }

  public setRotation(value: IVector3D): void {
    this._vimpPed.setRotation(value);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._vimpPed.forwardVector;
    return new Vector3D(x, y, z);
  }

  public freezePosition(freeze: boolean): void {
    this._vimpPed.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._vimpPed.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._vimpPed.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._vimpPed.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._vimpPed.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._vimpPed.alpha;
  }

  public resetAlpha(): void {
    this._vimpPed.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._vimpPed.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._vimpPed.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._vimpPed.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Ped, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Ped, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Ped, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Ped, remoteId);
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
    this._vimpPed.attachToEntity(
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
    this._vimpPed.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._vimpPed.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._vimpPed.isPlayingAnim(dictionary, name, taskFlag);
  }

  public setDecoration(collection: string, overlay: string): void {
    this._vimpPed.setDecoration(collection, overlay);
  }

  public removeDecoration(collection: string, overlay: string): void {
    this._vimpPed.removeDecoration(collection, overlay);
  }

  public clearDecorations(): void {
    this._vimpPed.clearDecorations();
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
    this._vimpPed.setHeadBlendData(
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
    this._vimpPed.setFaceFeature(index, value);
  }

  public setHeadOverlay(overlayId: number, index: number, opacity: number): void {
    this._vimpPed.setHeadOverlay(overlayId, index, opacity);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this._vimpPed.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this._vimpPed.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this._vimpPed.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this._vimpPed.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this._vimpPed.setPropertyVariation(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this._vimpPed.clearProp(componentId);
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._vimpPed.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public clearTasks(): void {
    this._vimpPed.clearTasks();
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
    this._vimpPed.taskPlayAnim(dictionary, name, blendInSpeed, blendOutSpeed, duration, flag, playbackRate);
  }

  public taskGoToCoordAnyMeans(
    x: number,
    y: number,
    z: number,
    speed: number,
    walkingStyle?: number,
    drivingFlags?: number,
  ): void {
    this._vimpPed.taskGoToCoordAnyMeans(x, y, z, speed, walkingStyle, drivingFlags);
  }

  public stopAnim(dictionary: string, name: string, blendOutSpeed: number): void {
    this._vimpPed.stopAnim(dictionary, name, blendOutSpeed);
  }

  public setBlockingOfNonTemporaryEvents(blocking: boolean): void {
    this._vimpPed.setBlockingOfNonTemporaryEvents(blocking);
  }
}
