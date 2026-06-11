/* eslint-disable @typescript-eslint/no-unused-vars */
import { BaseObjectType, type IMarkerType } from "@shared/entities";
import { type IRGBA, RGBA, type IVector3D, Vector3D } from "@shared/common/utils";
import { type Marker as CcmpMarker } from "@classic-mp/types/client";
import { type IMarker } from "../../common/marker/IMarker";

const notImplemented = (memberName: string): never => {
  throw new Error(`CCMPMarker.${memberName}: not implemented`);
};

export class CCMPMarker implements IMarker {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpMarker: CcmpMarker,
    private readonly _onDestroy: (marker: CCMPMarker) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpMarker.id;
  }

  public get remoteId(): number | null {
    return this._ccmpMarker.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Marker;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpMarker.isExists;
  }

  public get handle(): number {
    return 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._ccmpMarker.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpMarker.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpMarker.dimension;
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
    return this._ccmpMarker.markerType as IMarkerType;
  }

  public get visible(): boolean {
    return this._ccmpMarker.visible;
  }

  public get rotation(): Vector3D {
    const { x, y, z } = this._ccmpMarker.rotation;
    return new Vector3D(x, y, z);
  }

  public setVisible(_value: boolean): void {
    notImplemented("setVisible");
  }

  public setRotation(_value: IVector3D): void {
    notImplemented("setRotation");
  }

  public get scale(): number {
    return this._ccmpMarker.scale;
  }

  public setScale(_value: number): void {
    notImplemented("setScale");
  }

  public get color(): IRGBA {
    const { r, g, b, a } = this._ccmpMarker.color;
    return new RGBA(r, g, b, a);
  }

  public setColor(_value: IRGBA): void {
    notImplemented("setColor");
  }
}
