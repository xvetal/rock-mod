import { type IPed } from "../../common/ped/IPed";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { type RockSandboxPed as NativePed } from "@rock-sandbox/types/server";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";

export class RockSandboxPed extends RockSandboxEntity implements IPed {
  public constructor(private readonly _nativePed: NativePed) {
    super();
  }

  public override get id(): number {
    return this._nativePed.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Ped;
  }

  public override get isExists(): boolean {
    return this._nativePed.isExists;
  }

  public override get model(): number {
    return this._nativePed.modelHash;
  }

  public override get dimension(): number {
    return this._nativePed.dimension;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativePed.position;
    return new Vector3D(x, -z, y);
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativePed.rotation;
    return new Vector3D(x, -z, y);
  }

  public override setModel(value: string): void {
    this._nativePed.setModel(value);
  }

  public override setPosition(value: IVector3D): void {
    this._nativePed.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setRotation(value: IVector3D): void {
    this._nativePed.setRotation({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativePed.setDimension(value);
  }

  public override getNetData(name: string): unknown {
    return this._nativePed.getNetData(name);
  }

  public override setNetData(name: string, value: unknown): void {
    this._nativePed.setNetData(name, value);
  }

  public override destroy(): void {
    this._nativePed.destroy();
  }
}
const wrappers = new WeakMap<NativePed, RockSandboxPed>();
export function wrapPed(ped: NativePed): RockSandboxPed {
  let wrapper = wrappers.get(ped);
  if (wrapper === undefined) {
    wrapper = new RockSandboxPed(ped);
    wrappers.set(ped, wrapper);
  }
  return wrapper;
}
