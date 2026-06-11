/* eslint-disable @typescript-eslint/no-unused-vars */
import { type Colshape as CcmpColshape } from "@classic-mp/types/client";
import { BaseObjectType } from "@shared/entities";
import { type IVector3D, Vector3D } from "@shared/common/utils";
import { type IColshape } from "../../common/colshape/IColshape";

const notImplemented = (memberName: string): never => {
  throw new Error(`CCMPColshape.${memberName}: not implemented`);
};

export class CCMPColshape implements IColshape {
  private _destroyed = false;

  public constructor(
    private readonly _ccmpColshape: CcmpColshape,
    private readonly _onDestroy: (colshape: CCMPColshape) => void = () => {},
  ) {}

  public get id(): number {
    return this._ccmpColshape.id;
  }

  public get remoteId(): number | null {
    return this._ccmpColshape.remoteId;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Colshape;
  }

  public get isExists(): boolean {
    return !this._destroyed && this._ccmpColshape.isExists;
  }

  public get handle(): number {
    return 0;
  }

  public destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    this._ccmpColshape.destroy();
    this._onDestroy(this);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._ccmpColshape.position;
    return new Vector3D(x, y, z);
  }

  public get dimension(): number {
    return this._ccmpColshape.dimension;
  }

  public get key(): string | undefined {
    const value = this.getSyncedMeta("key");
    return typeof value === "string" ? value : undefined;
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

    const value = ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Colshape, remoteId, name);
    return value === undefined ? null : value;
  }

  public getSyncedMeta(key: string): unknown | undefined {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return undefined;
    }

    return ccmp.entities.getStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Colshape, remoteId, key);
  }

  public hasSyncedMeta(key: string): boolean {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return false;
    }

    return ccmp.entities.hasStreamSyncedMeta(ccmp.entities.ENTITY_TYPE.Colshape, remoteId, key);
  }

  public getSyncedMetaKeys(): readonly string[] {
    const remoteId = this.remoteId;
    if (remoteId === null) {
      return [];
    }

    return ccmp.entities.getStreamSyncedMetaKeys(ccmp.entities.ENTITY_TYPE.Colshape, remoteId);
  }
}
