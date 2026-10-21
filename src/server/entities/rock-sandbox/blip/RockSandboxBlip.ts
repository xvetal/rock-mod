import { type RockSandboxBlip as NativeBlip } from "@rock-sandbox/types/server";
import { type IBlip } from "../../common/blip/IBlip";
import { BaseObjectType, type IBlipColor, type IBlipSprite } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { nativeColor, nativeIcon, sdkColor, sdkSprite } from "./mapping";
export class RockSandboxBlip extends RockSandboxWorldObject implements IBlip {
  public constructor(private readonly _nativeBlip: NativeBlip) {
    super();
  }

  public override get id(): number {
    return this._nativeBlip.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Blip;
  }

  public override get isExists(): boolean {
    return this._nativeBlip.isExists;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeBlip.position;
    return new Vector3D(x, -z, y);
  }

  public override get dimension(): number {
    return this._nativeBlip.dimension;
  }

  public override setPosition(value: IVector3D): void {
    this._nativeBlip.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativeBlip.setDimension(value);
  }

  public override destroy(): void {
    this._nativeBlip.destroy();
  }

  public get sprite(): IBlipSprite {
    return sdkSprite(this._nativeBlip.icon);
  }

  public get color(): number {
    return sdkColor(this._nativeBlip.color);
  }

  public get alpha(): number {
    return this._nativeBlip.color.a;
  }

  public get name(): string {
    return this._nativeBlip.name;
  }

  public get scale(): number {
    return this._nativeBlip.scale;
  }

  public get drawDistance(): number {
    return this._nativeBlip.drawDistance;
  }

  public get global(): boolean {
    return this._nativeBlip.global;
  }

  public get shortRange(): boolean {
    return this._nativeBlip.shortRange;
  }

  public get rotation(): number {
    return this._nativeBlip.rotation;
  }

  public setName(value: string): void {
    this._nativeBlip.setName(value);
  }

  public setSprite(value: IBlipSprite): void {
    this._nativeBlip.setIcon(nativeIcon(value));
  }

  public setColor(value: IBlipColor): void {
    this._nativeBlip.setColor(nativeColor(value));
  }

  public setAlpha(value: number): void {
    this._nativeBlip.setAlpha(value);
  }
}
const wrappers = new WeakMap<NativeBlip, RockSandboxBlip>();
export function wrapBlip(blip: NativeBlip): RockSandboxBlip {
  let wrapper = wrappers.get(blip);
  if (wrapper === undefined) {
    wrapper = new RockSandboxBlip(blip);
    wrappers.set(blip, wrapper);
  }
  return wrapper;
}
