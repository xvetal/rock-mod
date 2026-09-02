/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Blip as VimpBlip } from "@vimp-mp/types/client";
import { BaseObjectType, type IBlipColor, type IBlipSprite } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBlip } from "../../common/blip/IBlip";

const notImplemented = (memberName: string): never => {
  throw new Error(`VIMPBlip.${memberName}: not implemented`);
};

export class VIMPBlip implements IBlip {
  private _destroyed = false;

  public constructor(
    private readonly _vimpBlip: VimpBlip,
    private readonly _onDestroy: (blip: VIMPBlip) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpBlip.id;
  }

  public get remoteId(): number | null {
    return this._vimpBlip.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Blip;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._vimpBlip.isExists;
  }

  public get handle(): number {
    return this._vimpBlip.handle;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._vimpBlip.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpBlip.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpBlip.dimension;
  }

  public setPosition(_value: IVector3D): void {
    notImplemented("setPosition");
  }

  public setDimension(_value: number): void {
    notImplemented("setDimension");
  }

  public setCoords(
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xAxis: boolean,
    _yAxis: boolean,
    _zAxis: boolean,
    _clearArea: boolean,
  ): void {
    notImplemented("setCoords");
  }

  public get name(): string {
    return this._vimpBlip.name;
  }

  public get sprite(): IBlipSprite {
    return this._vimpBlip.sprite as IBlipSprite;
  }

  public get color(): number {
    return this._vimpBlip.color;
  }

  public get alpha(): number {
    return this._vimpBlip.alpha;
  }

  public get scale(): number {
    return this._vimpBlip.scale;
  }

  public get drawDistance(): number {
    return this._vimpBlip.drawDistance;
  }

  public get global(): boolean {
    return this._vimpBlip.global;
  }

  public get shortRange(): boolean {
    return this._vimpBlip.shortRange;
  }

  public get rotation(): number {
    return this._vimpBlip.rotation;
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Blip, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Blip, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Blip, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Blip, remoteId);
  }

  public setSprite(_value: IBlipSprite): void {
    notImplemented("setSprite");
  }

  public setColor(_value: IBlipColor): void {
    notImplemented("setColor");
  }

  public setAlpha(_value: number): void {
    notImplemented("setAlpha");
  }

  public setShowHeadingIndicator(_value: boolean): void {
    notImplemented("setShowHeadingIndicator");
  }

  public setRotation(_value: number): void {
    notImplemented("setRotation");
  }
}
