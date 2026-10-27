import { type IObject } from "../../common/object/IObject";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxObject as NativeObject } from "@rock-sandbox/types/client";
import { BaseObjectType } from "../../../../shared";
import { Vector3D, type IVector3D } from "../../../../shared/common/utils";

export class RockSandboxObject extends RockSandboxEntity implements IObject {
  public constructor(private readonly _nativeObject: NativeObject) {
    super();
  }
  public override get id(): number {
    return this._nativeObject.id;
  }
  public override get remoteId(): number {
    return this._nativeObject.remoteId;
  }
  public override get type(): BaseObjectType {
    return BaseObjectType.Object;
  }
  public override get isExists(): boolean {
    return this._nativeObject.isExists;
  }
  public override get handle(): number {
    return this._nativeObject.handle;
  }
  public override get model(): number {
    return this._nativeObject.modelHash;
  }
  public override get position(): IVector3D {
    const { x, y, z } = this._nativeObject.position;
    return new Vector3D(x, -z, y);
  }
  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativeObject.rotation;
    return new Vector3D(x, -z, y);
  }
  public override get heading(): number {
    return this._nativeObject.rotation.y;
  }
  public override get dimension(): number {
    return this._nativeObject.dimension;
  }
  public override get alpha(): number {
    return this._nativeObject.alpha;
  }
  public override getVariable(name: string): unknown {
    return this._nativeObject.getNetData(name);
  }
  public getNetData(name: string): unknown {
    return this._nativeObject.getNetData(name);
  }
  public override getSyncedMeta(name: string): unknown {
    return this._nativeObject.getNetData(name);
  }
  public override hasSyncedMeta(name: string): boolean {
    return this._nativeObject.getNetData(name) !== undefined;
  }
  public override getSyncedMetaKeys(): readonly string[] {
    return this._nativeObject.getNetDataKeys();
  }
  public override getOffsetFromInWorldCoords(x: number, y: number, z: number): IVector3D {
    const p = this._nativeObject.getOffsetFromInWorldCoords(x, z, -y);
    return new Vector3D(p.x, -p.z, p.y);
  }
  public attachTo(
    _entity: Handle,
    _boneIndex: number,
    _xPos: number,
    _yPos: number,
    _zPos: number,
    _xRot: number,
    _yRot: number,
    _zRot: number,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxObject.attachTo");
  }

  public isAttachedTo(_entity: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxObject.isAttachedTo");
  }
}
const wrappers = new WeakMap<NativeObject, RockSandboxObject>();
export function wrapObject(object: NativeObject): RockSandboxObject {
  const old = wrappers.get(object);
  if (old) return old;
  const wrapper = new RockSandboxObject(object);
  wrappers.set(object, wrapper);
  return wrapper;
}
