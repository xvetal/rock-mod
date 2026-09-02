import { VIMPEntity } from "../entity/VIMPEntity";
import { type IPed } from "../../common/ped/IPed";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { MathClamp } from "../../../../shared/common/utils/math/Math";
import { RockMod } from "../../../RockMod";
import type { Ped as VimpPed } from "@vimp-mp/types/server";

export interface IVIMPPedOptions {
  vimpPed: VimpPed;
  onDestroy: (ped: VIMPPed) => void;
}

export class VIMPPed extends VIMPEntity implements IPed {
  private readonly _vimpPed: VimpPed;

  private readonly _onDestroy: (ped: VIMPPed) => void;

  public override get id(): number {
    return this._vimpPed.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public override get isExists(): boolean {
    return this._vimpPed.isExists;
  }

  public override get position(): IVector3D {
    const p = this._vimpPed.position;
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpPed.dimension;
  }

  public override get model(): number {
    return this._vimpPed.model;
  }

  // VIMP exposes only heading; map it onto rotation.z.
  public override get rotation(): IVector3D {
    return new Vector3D(0, 0, this._vimpPed.heading);
  }

  public get heading(): number {
    return this._vimpPed.heading;
  }

  public get health(): number {
    return this._vimpPed.health;
  }

  public get armour(): number {
    return this._vimpPed.armour;
  }

  protected override get vimpMeta(): VimpPed {
    return this._vimpPed;
  }

  public constructor(options: IVIMPPedOptions) {
    super();
    this._vimpPed = options.vimpPed;
    this._onDestroy = options.onDestroy;
  }

  public override destroy(): void {
    if (!this._vimpPed.isExists) return;
    this._vimpPed.destroy();
    this._onDestroy(this);
  }

  public override setPosition(value: IVector3D): void {
    this._vimpPed.teleport(value.x, value.y, value.z);
  }

  public override setDimension(value: number): void {
    this._vimpPed.dimension = value;
  }

  public override setModel(value: string): void {
    // VIMP ped.model is u32; hash the name via the shared util before assignment.
    this._vimpPed.model = RockMod.instance.utils.hash(value);
  }

  public override setRotation(value: IVector3D): void {
    // VIMP exposes only heading; pitch/roll (x/y) are silently dropped.
    this._vimpPed.heading = value.z;
  }

  public setHeading(value: number): void {
    this._vimpPed.heading = value;
  }

  public setHealth(value: number): void {
    this._vimpPed.health = MathClamp(value, 0, 200);
  }

  public setArmour(value: number): void {
    this._vimpPed.armour = MathClamp(value, 0, 100);
  }
}
