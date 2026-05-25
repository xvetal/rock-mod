import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type Ped as CcmpPed } from "@classic-mp/types/client";
import { type IBaseObject } from "../../common/baseObject/IBaseObject";
import { type IPed } from "../../common/ped/IPed";

export class CCMPPed implements IPed {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpPed: CcmpPed,
    private readonly _onDestroy: (ped: CCMPPed) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpPed.id;
  }

  public get remoteId(): number {
    return this._ccmpPed.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpPed.isAlive;
  }

  public get handle(): number {
    return this._ccmpPed.handle;
  }

  public destroy(): void {
    if (this._destroyed) {
      return;
    }

    this._destroyed = true;
    this._ccmpPed.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpPed.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpPed.dimension;
  }

  public setPosition(value: IVector3D): void {
    this._ccmpPed.setPosition(value);
  }

  public setDimension(value: number): void {
    this._ccmpPed.setDimension(value);
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
    this._ccmpPed.setCoords(xPos, yPos, zPos, xAxis, yAxis, zAxis, clearArea);
  }

  public get model(): number {
    return this._ccmpPed.model;
  }

  public get heading(): number {
    return this._ccmpPed.heading;
  }

  public setHeading(heading: number): void {
    this._ccmpPed.setHeading(heading);
  }

  public setModel(value: string): void {
    this._ccmpPed.setModel(value);
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpPed.rotation;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._ccmpPed.setRotation(value);
  }

  public get forwardVector(): Vector3D {
    const { x, y, z } = this._ccmpPed.forwardVector;
    return new Vector3D(x, y, z);
  }

  public freezePosition(freeze: boolean): void {
    this._ccmpPed.freezePosition(freeze);
  }

  public setCollision(collision: boolean, keepPhysics: boolean): void {
    this._ccmpPed.setCollision(collision, keepPhysics);
  }

  public setInvincible(invincible: boolean): void {
    this._ccmpPed.setInvincible(invincible);
  }

  public setVisible(visible: boolean): void {
    this._ccmpPed.setVisible(visible);
  }

  public setAlpha(alpha: number): void {
    this._ccmpPed.setAlpha(alpha);
  }

  public get alpha(): number {
    return this._ccmpPed.alpha;
  }

  public resetAlpha(): void {
    this._ccmpPed.resetAlpha();
  }

  public getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._ccmpPed.getOffsetFromInWorldCoords(offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public getBoneIndexByName(boneName: string): number {
    return this._ccmpPed.getBoneIndexByName(boneName);
  }

  public getWorldPositionOfBone(boneIndex: number): IVector3D {
    const { x, y, z } = this._ccmpPed.getWorldPositionOfBone(boneIndex);
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    void name;
    return null;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    void key;
    return undefined;
  }

  public hasSyncedMeta(key: string): boolean {
    void key;
    return false;
  }

  public getSyncedMetaKeys(): readonly string[] {
    return [];
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
    this._ccmpPed.attachToEntity(
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
    this._ccmpPed.detach(useDetachVelocity, collision);
  }

  public getSpeed(): number {
    return this._ccmpPed.getSpeed();
  }

  public isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean {
    return this._ccmpPed.isPlayingAnim(dictionary, name, taskFlag);
  }

  public setDecoration(collection: string, overlay: string): void {
    this._ccmpPed.setDecoration(collection, overlay);
  }

  public removeDecoration(collection: string, overlay: string): void {
    this._ccmpPed.removeDecoration(collection, overlay);
  }

  public clearDecorations(): void {
    this._ccmpPed.clearDecorations();
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
    this._ccmpPed.setHeadBlendData(
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
    this._ccmpPed.setFaceFeature(index, value);
  }

  public setHeadOverlay(overlayId: number, index: number, opacity: number): void {
    this._ccmpPed.setHeadOverlay(overlayId, index, opacity);
  }

  public setHeadOverlayColor(overlayId: number, colorTypeId: number, firstColor: number, secondColor: number): void {
    this._ccmpPed.setHeadOverlayColor(overlayId, colorTypeId, firstColor, secondColor);
  }

  public setEyeColor(eyeColor: number): void {
    this._ccmpPed.setEyeColor(eyeColor);
  }

  public setHairColor(colorId: number, highlightColorId: number): void {
    this._ccmpPed.setHairColor(colorId, highlightColorId);
  }

  public setComponentVariation(componentId: number, drawableId: number, textureId: number, paletteId: number): void {
    this._ccmpPed.setComponentVariation(componentId, drawableId, textureId, paletteId);
  }

  public setPropertyVariation(componentId: number, drawableId: number, textureId: number, attach: boolean): void {
    this._ccmpPed.setPropertyVariation(componentId, drawableId, textureId, attach);
  }

  public clearProp(componentId: number): void {
    this._ccmpPed.clearProp(componentId);
  }

  public getBoneCoords(boneId: number, offsetX: number, offsetY: number, offsetZ: number): IVector3D {
    const { x, y, z } = this._ccmpPed.getBoneCoords(boneId, offsetX, offsetY, offsetZ);
    return new Vector3D(x, y, z);
  }

  public clearTasks(): void {
    this._ccmpPed.clearTasks();
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
    this._ccmpPed.taskPlayAnim(dictionary, name, blendInSpeed, blendOutSpeed, duration, flag, playbackRate);
  }

  public taskGoToCoordAnyMeans(
    x: number,
    y: number,
    z: number,
    speed: number,
    walkingStyle?: number,
    drivingFlags?: number,
  ): void {
    this._ccmpPed.taskGoToCoordAnyMeans(x, y, z, speed, walkingStyle, drivingFlags);
  }

  public stopAnim(dictionary: string, name: string, blendOutSpeed: number): void {
    this._ccmpPed.stopAnim(dictionary, name, blendOutSpeed);
  }

  public setBlockingOfNonTemporaryEvents(blocking: boolean): void {
    this._ccmpPed.setBlockingOfNonTemporaryEvents(blocking);
  }
}
