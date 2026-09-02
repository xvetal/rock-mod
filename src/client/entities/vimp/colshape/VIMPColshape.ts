/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Colshape as VimpColshape } from "@vimp-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IColshape } from "../../common/colshape/IColshape";

const notImplemented = (memberName: string): never => {
  throw new Error(`VIMPColshape.${memberName}: not implemented`);
};

export class VIMPColshape implements IColshape {
  private _destroyed = false;

  public constructor(
    private readonly _vimpColshape: VimpColshape,
    private readonly _onDestroy: (colshape: VIMPColshape) => void = () => {},
  ) {}

  public get id(): number {
    return this._vimpColshape.id;
  }

  public get remoteId(): number | null {
    return this._vimpColshape.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Colshape;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._vimpColshape.isExists;
  }

  public get handle(): number {
    return 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._vimpColshape.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._vimpColshape.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._vimpColshape.dimension;
  }

  public get key(): string | undefined {
    return this._vimpColshape.key;
  }

  public setPosition(_value: IVector3D): void {
    notImplemented("setPosition");
  }

  public setDimension(_value: number): void {
    notImplemented("setDimension");
  }

  public setCoords(
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xAxis: boolean,
    _yAxis: boolean,
    _zAxis: boolean,
    _clearArea: boolean,
  ): void {
    notImplemented("setCoords");
  }

  public getVariable(name: string): unknown | null {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return null;
    }

    const value = vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Colshape, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return vimp.entities.getStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Colshape, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return vimp.entities.hasStreamSyncedMeta(vimp.entities.ENTITY_TYPE.Colshape, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return vimp.entities.getStreamSyncedMetaKeys(vimp.entities.ENTITY_TYPE.Colshape, remoteId);
  }
}
