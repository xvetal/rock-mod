import { CCMPEntity } from "../entity/CCMPEntity";
import { type IPed } from "../../common/ped/IPed";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { MathClamp } from "../../../../shared/common/utils/math/Math";
import { RockMod } from "../../../RockMod";
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

  public override get dimension(): number {
    return this._ccmpPed.dimension;
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

  protected override get ccmpMeta(): CcmpPed {
    return this._ccmpPed;
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

  public override setPosition(value: IVector3D): void {
    this._ccmpPed.teleport(value.x, value.y, value.z);
  }

  public override setDimension(value: number): void {
    this._ccmpPed.dimension = value;
  }

  public override setModel(value: string): void {
    // CCMP ped.model is u32; hash the name via the shared util before assignment.
    this._ccmpPed.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    // CCMP exposes only heading; pitch/roll (x/y) are silently dropped.
    this._ccmpPed.heading = value.z;
  }

  public setHeading(value: number): void {
    this._ccmpPed.heading = value;
  }

  public setHealth(value: number): void {
    this._ccmpPed.health = MathClamp(value, 0, 200);
  }

  public setArmour(value: number): void {
    this._ccmpPed.armour = MathClamp(value, 0, 100);
  }
}
