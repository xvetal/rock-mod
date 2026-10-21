import { type RockSandboxObject as NativeObject } from "@rock-sandbox/types/server";
import { type IObject } from "../../common/object/IObject";
import { BaseObjectType } from "../../../../shared";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
export class RockSandboxObject extends RockSandboxEntity implements IObject {
  public constructor(private readonly _nativeObject: NativeObject) {
    super();
  }

  public override get id(): number {
    return this._nativeObject.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Object;
  }

  public override get isExists(): boolean {
    return this._nativeObject.isExists;
  }

  public override get model(): number {
    return this._nativeObject.modelHash;
  }

  public override get dimension(): number {
    return this._nativeObject.dimension;
  }

  public get alpha(): number {
    return this._nativeObject.alpha;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeObject.position;
    return new Vector3D(x, -z, y);
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativeObject.rotation;
    return new Vector3D(x, -z, y);
  }

  public override setPosition(value: IVector3D): void {
    this._nativeObject.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setRotation(value: IVector3D): void {
    this._nativeObject.setRotation({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativeObject.setDimension(value);
  }

  public setAlpha(value: number): void {
    this._nativeObject.setAlpha(value);
  }

  public override getNetData(name: string): unknown {
    return this._nativeObject.getNetData(name);
  }

  public override setNetData(name: string, value: unknown): void {
    this._nativeObject.setNetData(name, value);
  }

  public override destroy(): void {
    this._nativeObject.destroy();
  }
}
const wrappers = new WeakMap<NativeObject, RockSandboxObject>();
export function wrapObject(object: NativeObject): RockSandboxObject {
  let wrapper = wrappers.get(object);
  if (wrapper === undefined) {
    wrapper = new RockSandboxObject(object);
    wrappers.set(object, wrapper);
  }
  return wrapper;
}
