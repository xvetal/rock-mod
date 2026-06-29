/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Blip as CcmpBlip } from "@classic-mp/types/client";
import { BaseObjectType, type IBlipColor, type IBlipSprite } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IBlip } from "../../common/blip/IBlip";

const notImplemented = (memberName: string): never => {
  throw new Error(`CCMPBlip.${memberName}: not implemented`);
};

export class CCMPBlip implements IBlip {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpBlip: CcmpBlip,
    private readonly _onDestroy: (blip: CCMPBlip) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpBlip.id;
  }

  public get remoteId(): number | null {
    return this._ccmpBlip.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Blip;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpBlip.isExists;
  }

  public get handle(): number {
    return this._ccmpBlip.handle;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._ccmpBlip.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpBlip.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpBlip.dimension;
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
    return this._ccmpBlip.name;
  }

  public get sprite(): IBlipSprite {
    return this._ccmpBlip.sprite as IBlipSprite;
  }

  public get color(): number {
    return this._ccmpBlip.color;
  }

  public get alpha(): number {
    return this._ccmpBlip.alpha;
  }

  public get scale(): number {
    return this._ccmpBlip.scale;
  }

  public get drawDistance(): number {
    return this._ccmpBlip.drawDistance;
  }

  public get global(): boolean {
    return this._ccmpBlip.global;
  }

  public get shortRange(): boolean {
    return this._ccmpBlip.shortRange;
  }

  public get rotation(): number {
    return this._ccmpBlip.rotation;
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Blip, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Blip, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Blip, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Blip, remoteId);
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
