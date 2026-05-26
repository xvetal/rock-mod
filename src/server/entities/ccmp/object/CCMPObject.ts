import { CCMPEntity } from "../entity/CCMPEntity";
import { type IObject } from "../../common/object/IObject";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { RockMod } from "../../../RockMod";
import type { StreamSyncedMeta } from "@classic-mp/types/server";

export interface ICCMPObjectNative extends StreamSyncedMeta {
  id: number;
  isExists: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  model: number;
  dimension: number;
  destroy(): boolean;
}

export interface ICCMPObjectOptions {
  ccmpObject: ICCMPObjectNative;
  alpha: number;
  onDestroy: (object: CCMPObject) => void;
}

export class CCMPObject extends CCMPEntity implements IObject {
  private readonly _ccmpObject: ICCMPObjectNative;

  private readonly _onDestroy: (object: CCMPObject) => void;

  private _alpha: number;

  public override get id(): number {
    return this._ccmpObject.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public override get isExists(): boolean {
    return this._ccmpObject.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpObject.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpObject.dimension;
  }

  public override get model(): number {
    return this._ccmpObject.model;
  }

  public override get rotation(): IVector3D {
    const r = this._ccmpObject.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

  public get alpha(): number {
    return this._alpha;
  }

  protected override get ccmpMeta(): ICCMPObjectNative {
    return this._ccmpObject;
  }

  public constructor(options: ICCMPObjectOptions) {
    super();
    this._ccmpObject = options.ccmpObject;
    this._alpha = options.alpha;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpObject.isExists) return;
    this._ccmpObject.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpObject.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._ccmpObject.dimension = value;
  }

  public override setModel(value: string): void {
    this._ccmpObject.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    this._ccmpObject.rotation = { x: value.x, y: value.y, z: value.z };
  }

  // CCMP runtime currently has no object alpha op; keep an API-level cache.
  public setAlpha(value: number): void {
    this._alpha = value;
  }
}
