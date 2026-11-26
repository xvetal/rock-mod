import { type IColshape } from "../../common/colshape/IColshape";
import { VIMPWorldObject } from "../worldObject/VIMPWorldObject";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import type { Colshape as VimpColshape, Player as VimpPlayer } from "@vimp-mp/types/server";

export interface IVIMPColshapeOptions {
  vimpColshape: VimpColshape;
  onDestroy: (colshape: VIMPColshape) => void;
}

export abstract class VIMPColshape extends VIMPWorldObject implements IColshape {
  private readonly _vimpColshape: VimpColshape;

  private readonly _onDestroy: (colshape: VIMPColshape) => void;

  public override get id(): number {
    return this._vimpColshape.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Colshape;
  }

  public override get isExists(): boolean {
    return this._vimpColshape.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpColshape.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpColshape.dimension;
  }

  public get key(): string | undefined {
    return this._vimpColshape.key;
  }

  public get playersInside(): readonly VimpPlayer[] {
    return this._vimpColshape.playersInside;
  }

  public getNetData(name: string): unknown {
    return this._vimpColshape.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._vimpColshape.setStreamSyncedMeta(name, value);
  }

  protected constructor(options: IVIMPColshapeOptions) {
    super();
    this._vimpColshape = options.vimpColshape;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._vimpColshape.isExists) return;
    this._vimpColshape.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpColshape.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._vimpColshape.dimension = value;
  }
}
