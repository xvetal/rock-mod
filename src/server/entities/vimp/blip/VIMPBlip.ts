import { VIMPWorldObject } from "../worldObject/VIMPWorldObject";
import { type IBlip } from "../../common/blip/IBlip";
import { BaseObjectType, type IBlipColor, type IBlipSprite } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import type { Blip as VimpBlip } from "@vimp-mp/types/server";

export interface IVIMPBlipOptions {
  vimpBlip: VimpBlip;
  onDestroy: (blip: VIMPBlip) => void;
}

export class VIMPBlip extends VIMPWorldObject implements IBlip {
  private readonly _vimpBlip: VimpBlip;

  private readonly _onDestroy: (blip: VIMPBlip) => void;

  public override get id(): number {
    return this._vimpBlip.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Blip;
  }

  public override get isExists(): boolean {
    return this._vimpBlip.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpBlip.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpBlip.dimension;
  }

  public get name(): string {
    return this._vimpBlip.name;
  }

  public get sprite(): IBlipSprite {
    return this._vimpBlip.sprite;
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

  public constructor(options: IVIMPBlipOptions) {
    super();
    this._vimpBlip = options.vimpBlip;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._vimpBlip.isExists) return;
    this._vimpBlip.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpBlip.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._vimpBlip.dimension = value;
  }

  public getNetData(name: string): unknown {
    return this._vimpBlip.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._vimpBlip.setStreamSyncedMeta(name, value);
  }

  public setName(value: string): void {
    this._vimpBlip.name = value;
  }

  public setSprite(value: IBlipSprite): void {
    this._vimpBlip.sprite = value;
  }

  public setColor(value: IBlipColor): void {
    this._vimpBlip.color = value;
  }

  public setAlpha(value: number): void {
    this._vimpBlip.alpha = value;
  }
}
