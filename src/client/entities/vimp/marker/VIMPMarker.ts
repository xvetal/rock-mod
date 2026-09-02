/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType, type IMarkerType } from "@shared/entities";
import { type IRGBA, RGBA, type IVector3D, Vector3D } from "@shared/common/utils";
import { type Marker as VimpMarker } from "@vimp-mp/types/client";
import { type IMarker } from "../../common/marker/IMarker";

const notImplemented = (memberName: string): never => {
  throw new Error(`VIMPMarker.${memberName}: not implemented`);
};

export class VIMPMarker implements IMarker {
  private _destroyed = false;

  public constructor(
    private readonly _vimpMarker: VimpMarker,
    private readonly _onDestroy: (marker: VIMPMarker) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpMarker.id;
  }

  public get remoteId(): number | null {
    return this._vimpMarker.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Marker;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._vimpMarker.isExists;
  }

  public get handle(): number {
    return 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._vimpMarker.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpMarker.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpMarker.dimension;
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

  public get markerType(): IMarkerType {
    return this._vimpMarker.markerType as IMarkerType;
  }

  public get visible(): boolean {
    return this._vimpMarker.visible;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._vimpMarker.rotation;
    return new Vector3D(x, y, z);
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Marker, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Marker, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Marker, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Marker, remoteId);
  }

  public setVisible(_value: boolean): void {
    notImplemented("setVisible");
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("setRotation");
  }

  public get scale(): number {
    return this._vimpMarker.scale;
  }

  public setScale(_value: number): void {
    notImplemented("setScale");
  }

  public get color(): IRGBA {
    const { r, g, b, a } = this._vimpMarker.color;
    return new RGBA(r, g, b, a);
  }

  public setColor(_value: IRGBA): void {
    notImplemented("setColor");
  }
}
