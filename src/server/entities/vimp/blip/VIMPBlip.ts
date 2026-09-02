import { CCMPWorldObject } from "../worldObject/VIMPWorldObject";
import { type IBlip } from "../../common/blip/IBlip";
import { BaseObjectType, type IBlipColor, type IBlipSprite } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import type { Blip as CcmpBlip } from "@classic-mp/types/server";

export interface ICCMPBlipOptions {
  ccmpBlip: CcmpBlip;
  onDestroy: (blip: CCMPBlip) => void;
}

export class CCMPBlip extends CCMPWorldObject implements IBlip {
  private readonly _ccmpBlip: CcmpBlip;

  private readonly _onDestroy: (blip: CCMPBlip) => void;

  public override get id(): number {
    return this._ccmpBlip.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Blip;
  }

  public override get isExists(): boolean {
    return this._ccmpBlip.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpBlip.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpBlip.dimension;
  }

  public get name(): string {
    return this._ccmpBlip.name;
  }

  public get sprite(): IBlipSprite {
    return this._ccmpBlip.sprite;
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

  public constructor(options: ICCMPBlipOptions) {
    super();
    this._ccmpBlip = options.ccmpBlip;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpBlip.isExists) return;
    this._ccmpBlip.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpBlip.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._ccmpBlip.dimension = value;
  }

  public getNetData(name: string): unknown {
    return this._ccmpBlip.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._ccmpBlip.setStreamSyncedMeta(name, value);
  }

  public setName(value: string): void {
    this._ccmpBlip.name = value;
  }

  public setSprite(value: IBlipSprite): void {
    this._ccmpBlip.sprite = value;
  }

  public setColor(value: IBlipColor): void {
    this._ccmpBlip.color = value;
  }

  public setAlpha(value: number): void {
    this._ccmpBlip.alpha = value;
  }
}
