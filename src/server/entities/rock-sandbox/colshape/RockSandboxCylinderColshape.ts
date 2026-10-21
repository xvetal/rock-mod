import { type RockSandboxCylinderColshape as NativeColshape } from "@rock-sandbox/types/server";
import { type ICylinderColshape } from "../../common/colshape/ICylinderColshape";
import { RockSandboxColshape } from "./RockSandboxColshape";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxCylinderColshape extends RockSandboxColshape implements ICylinderColshape {
  public constructor(private readonly _nativeColshape: NativeColshape) {
    super();
  }

  public override get id(): number {
    return this._nativeColshape.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Colshape;
  }

  public override get isExists(): boolean {
    return this._nativeColshape.isExists;
  }

  public override get key(): string | undefined {
    return this._nativeColshape.key;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeColshape.position;
    return new Vector3D(x, -z, y);
  }

  public override get dimension(): number {
    return this._nativeColshape.dimension;
  }

  public override setPosition(value: IVector3D): void {
    this._nativeColshape.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativeColshape.setDimension(value);
  }

  public override destroy(): void {
    this._nativeColshape.destroy();
  }
}
const wrappers = new WeakMap<NativeColshape, RockSandboxCylinderColshape>();
export function wrapColshape(colshape: NativeColshape): RockSandboxCylinderColshape {
  let wrapper = wrappers.get(colshape);
  if (wrapper === undefined) {
    wrapper = new RockSandboxCylinderColshape(colshape);
    wrappers.set(colshape, wrapper);
  }
  return wrapper;
}
