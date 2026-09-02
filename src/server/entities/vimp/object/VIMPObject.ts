import { VIMPEntity } from "../entity/VIMPEntity";
import { type IObject } from "../../common/object/IObject";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { RockMod } from "../../../RockMod";
import type { StreamSyncedMeta } from "@vimp-mp/types/server";

export interface IVIMPObjectNative extends StreamSyncedMeta {
  id: number;
  isExists: boolean;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  model: number;
  dimension: number;
  alpha: number;
  destroy(): boolean;
}

export interface IVIMPObjectOptions {
  vimpObject: IVIMPObjectNative;
  alpha: number;
  onDestroy: (object: VIMPObject) => void;
}

export class VIMPObject extends VIMPEntity implements IObject {
  private readonly _vimpObject: IVIMPObjectNative;

  private readonly _onDestroy: (object: VIMPObject) => void;

  public override get id(): number {
    return this._vimpObject.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public override get isExists(): boolean {
    return this._vimpObject.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpObject.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpObject.dimension;
  }

  public override get model(): number {
    return this._vimpObject.model;
  }

  public override get rotation(): IVector3D {
    const r = this._vimpObject.rotation;
    return new Vector3D(r.x, r.y, r.z);
  }

  public get alpha(): number {
    return this._vimpObject.alpha;
  }

  protected override get vimpMeta(): IVIMPObjectNative {
    return this._vimpObject;
  }

  public constructor(options: IVIMPObjectOptions) {
    super();
    this._vimpObject = options.vimpObject;
    this._vimpObject.alpha = options.alpha;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._vimpObject.isExists) return;
    this._vimpObject.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpObject.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._vimpObject.dimension = value;
  }

  public override setModel(value: string): void {
    this._vimpObject.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    this._vimpObject.rotation = { x: value.x, y: value.y, z: value.z };
  }

  public setAlpha(value: number): void {
    this._vimpObject.alpha = value;
  }
}
