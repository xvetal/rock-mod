import { type RockSandboxMarker as NativeMarker } from "@rock-sandbox/types/server";
import { type IMarker } from "../../common/marker/IMarker";
import { BaseObjectType, type IMarkerType } from "../../../../shared";
import { type IRGBA, type IVector3D, RGBA, Vector3D } from "../../../../shared/common/utils";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { sdkMarkerType } from "./mapping";
export class RockSandboxMarker extends RockSandboxWorldObject implements IMarker {
  public constructor(private readonly _nativeMarker: NativeMarker) {
    super();
  }

  public override get id(): number {
    return this._nativeMarker.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Marker;
  }

  public override get isExists(): boolean {
    return this._nativeMarker.isExists;
  }

  public override get dimension(): number {
    return this._nativeMarker.dimension;
  }

  public get markerType(): IMarkerType {
    return sdkMarkerType(this._nativeMarker.type);
  }

  public get visible(): boolean {
    return this._nativeMarker.visible;
  }

  public get scale(): number {
    return this._nativeMarker.scale;
  }

  public get color(): IRGBA {
    const { r, g, b, a } = this._nativeMarker.color;
    return new RGBA(r, g, b, a);
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeMarker.position;
    return new Vector3D(x, -z, y);
  }

  public override setPosition(value: IVector3D): void {
    this._nativeMarker.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this._nativeMarker.rotation;
    return new Vector3D(x, -z, y);
  }

  public setRotation(value: IVector3D): void {
    this._nativeMarker.setRotation({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativeMarker.setDimension(value);
  }

  public override destroy(): void {
    this._nativeMarker.destroy();
  }

  public setVisible(value: boolean): void {
    this._nativeMarker.setVisible(value);
  }

  public setScale(value: number): void {
    this._nativeMarker.setScale(value);
  }

  public setColor(value: IRGBA): void {
    this._nativeMarker.setColor({ r: value.r, g: value.g, b: value.b, a: value.a });
  }
}
const wrappers = new WeakMap<NativeMarker, RockSandboxMarker>();
export function wrapMarker(marker: NativeMarker): RockSandboxMarker {
  let wrapper = wrappers.get(marker);
  if (wrapper === undefined) {
    wrapper = new RockSandboxMarker(marker);
    wrappers.set(marker, wrapper);
  }
  return wrapper;
}
