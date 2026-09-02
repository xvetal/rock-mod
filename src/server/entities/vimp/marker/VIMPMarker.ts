import { VIMPWorldObject } from "../worldObject/VIMPWorldObject";
import { type IMarker } from "../../common/marker/IMarker";
import { BaseObjectType, type IMarkerType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { type IRGBA, RGBA } from "../../../../shared/common/utils/color/RGBA";
import type { Marker as VimpMarker } from "@vimp-mp/types/server";

export interface IVIMPMarkerOptions {
  vimpMarker: VimpMarker;
  onDestroy: (marker: VIMPMarker) => void;
}

export class VIMPMarker extends VIMPWorldObject implements IMarker {
  private readonly _vimpMarker: VimpMarker;

  private readonly _onDestroy: (marker: VIMPMarker) => void;

  public override get id(): number {
    return this._vimpMarker.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Marker;
  }

  public override get isExists(): boolean {
    return this._vimpMarker.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpMarker.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpMarker.dimension;
  }

  public get markerType(): IMarkerType {
    return this._vimpMarker.type;
  }

  public get visible(): boolean {
    return this._vimpMarker.visible;
  }

  public get scale(): number {
    return this._vimpMarker.scale;
  }

  public get color(): IRGBA {
    const c = this._vimpMarker.color;
    return new RGBA(c.r, c.g, c.b, c.a);
  }

  public get rotation(): IVector3D {
    const r = this._vimpMarker.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

  public constructor(options: IVIMPMarkerOptions) {
    super();
    this._vimpMarker = options.vimpMarker;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._vimpMarker.isExists) return;
    this._vimpMarker.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpMarker.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._vimpMarker.dimension = value;
  }

  public getNetData(name: string): unknown {
    return this._vimpMarker.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._vimpMarker.setStreamSyncedMeta(name, value);
  }

  public setVisible(value: boolean): void {
    this._vimpMarker.visible = value;
  }

  public setScale(value: number): void {
    this._vimpMarker.scale = value;
  }

  public setColor(value: IRGBA): void {
    this._vimpMarker.color = {
      r: value.r,
      g: value.g,
      b: value.b,
      a: value.a ?? 255,
    };
  }

  public setRotation(value: IVector3D): void {
    this._vimpMarker.rotation = { x: value.x, y: value.y, z: value.z };
  }
}
