import { CCMPWorldObject } from "../worldObject/CCMPWorldObject";
import { type IMarker } from "../../common/marker/IMarker";
import { BaseObjectType, type IMarkerType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { type IRGBA, RGBA } from "../../../../shared/common/utils/color/RGBA";
import type { Marker as CcmpMarker } from "@classic-mp/types/server";

export interface ICCMPMarkerOptions {
  ccmpMarker: CcmpMarker;
  onDestroy: (marker: CCMPMarker) => void;
}

export class CCMPMarker extends CCMPWorldObject implements IMarker {
  private readonly _ccmpMarker: CcmpMarker;

  private readonly _onDestroy: (marker: CCMPMarker) => void;

  public override get id(): number {
    return this._ccmpMarker.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Marker;
  }

  public override get isExists(): boolean {
    return this._ccmpMarker.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpMarker.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpMarker.dimension;
  }

  public get markerType(): IMarkerType {
    return this._ccmpMarker.type;
  }

  public get visible(): boolean {
    return this._ccmpMarker.visible;
  }

  public get scale(): number {
    return this._ccmpMarker.scale;
  }

  public get color(): IRGBA {
    const c = this._ccmpMarker.color;
    return new RGBA(c.r, c.g, c.b, c.a);
  }

  public get rotation(): IVector3D {
    const r = this._ccmpMarker.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

  public constructor(options: ICCMPMarkerOptions) {
    super();
    this._ccmpMarker = options.ccmpMarker;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpMarker.isExists) return;
    this._ccmpMarker.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpMarker.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._ccmpMarker.dimension = value;
  }

  public getNetData(name: string): unknown {
    return this._ccmpMarker.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._ccmpMarker.setStreamSyncedMeta(name, value);
  }

  public setVisible(value: boolean): void {
    this._ccmpMarker.visible = value;
  }

  public setScale(value: number): void {
    this._ccmpMarker.scale = value;
  }

  public setColor(value: IRGBA): void {
    this._ccmpMarker.color = {
      r: value.r,
      g: value.g,
      b: value.b,
      a: value.a ?? 255,
    };
  }

  public setRotation(value: IVector3D): void {
    this._ccmpMarker.rotation = { x: value.x, y: value.y, z: value.z };
  }
}
