import { CCMPEntity } from "../entity/CCMPEntity";
import { type IPed } from "../../common/ped/IPed";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import type { Ped as CcmpPed } from "@classic-mp/types/server";

export interface ICCMPPedOptions {
  ccmpPed: CcmpPed;
  onDestroy: (ped: CCMPPed) => void;
}

export class CCMPPed extends CCMPEntity implements IPed {
  private readonly _ccmpPed: CcmpPed;

  private readonly _onDestroy: (ped: CCMPPed) => void;

  public override get id(): number {
    return this._ccmpPed.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public override get isExists(): boolean {
    return this._ccmpPed.isExists;
  }

  public override get position(): IVector3D {
    const p = this._ccmpPed.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  // CCMP peds have no per-entity dimension yet; report 0 (global).
  public override get dimension(): number {
    return 0;
  }

  public override get model(): number {
    return this._ccmpPed.model;
  }

  // CCMP exposes only heading; map it onto rotation.z.
  public override get rotation(): IVector3D {
    return new Vector3D(0, 0, this._ccmpPed.heading);
  }

  public get heading(): number {
    return this._ccmpPed.heading;
  }

  public get health(): number {
    return this._ccmpPed.health;
  }

  public get armour(): number {
    return this._ccmpPed.armour;
  }

  public constructor(options: ICCMPPedOptions) {
    super();
    this._ccmpPed = options.ccmpPed;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._ccmpPed.isExists) return;
    this._ccmpPed.destroy();
    this._onDestroy(this);
  }

  public override setPosition(_value: IVector3D): void {
    throw new Error("CCMPPed.setPosition: not supported by CCMP yet");
  }

  public override setDimension(_value: number): void {
    throw new Error("CCMPPed.setDimension: not supported by CCMP yet");
  }

  public override setModel(_value: string): void {
    throw new Error("CCMPPed.setModel: not supported by CCMP yet");
  }

  public override setRotation(_value: IVector3D): void {
    throw new Error("CCMPPed.setRotation: not supported by CCMP yet");
  }

  public override getNetData(_name: string): unknown {
    throw new Error("CCMPPed.getNetData: not supported by CCMP yet");
  }

  public override setNetData(_name: string, _value: unknown): void {
    throw new Error("CCMPPed.setNetData: not supported by CCMP yet");
  }
}
