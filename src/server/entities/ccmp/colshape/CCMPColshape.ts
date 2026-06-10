import { type IColshape } from "../../common/colshape/IColshape";
import { CCMPWorldObject } from "../worldObject/CCMPWorldObject";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import type { Colshape as CcmpColshape, Player as CcmpPlayer } from "@classic-mp/types/server";

export interface ICCMPColshapeOptions {
  ccmpColshape: CcmpColshape;
  onDestroy: (colshape: CCMPColshape) => void;
}

export abstract class CCMPColshape extends CCMPWorldObject implements IColshape {
  private readonly _ccmpColshape: CcmpColshape;

  private readonly _onDestroy: (colshape: CCMPColshape) => void;

  public override get id(): number {
    return this._ccmpColshape.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Colshape;
  }

  public override get isExists(): boolean {
    return this._ccmpColshape.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpColshape.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpColshape.dimension;
  }

  public get playersInside(): readonly CcmpPlayer[] {
    return this._ccmpColshape.playersInside;
  }

  public getNetData(name: string): unknown {
    return this._ccmpColshape.getStreamSyncedMeta(name);
  }

  public setNetData(name: string, value: unknown): void {
    this._ccmpColshape.setStreamSyncedMeta(name, value);
  }

  protected constructor(options: ICCMPColshapeOptions) {
    super();
    this._ccmpColshape = options.ccmpColshape;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpColshape.isExists) return;
    this._ccmpColshape.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpColshape.position = { x: value.x, y: value.y, z: value.z };
  }

  public override setDimension(value: number): void {
    this._ccmpColshape.dimension = value;
  }
}
