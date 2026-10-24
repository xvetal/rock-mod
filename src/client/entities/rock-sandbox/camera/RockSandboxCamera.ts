import { type ICamera } from "../../common/camera/ICamera";
import { type IVector3D, type Vector3D } from "../../../../shared/common/utils";
import { RockSandboxBaseObject } from "../baseObject/RockSandboxBaseObject";
import { type RockSandboxCamera as NativeCamera } from "@rock-sandbox/types/client";
import { BaseObjectType, Vector3D as Vector } from "../../../../shared";

export class RockSandboxCamera extends RockSandboxBaseObject implements ICamera {
  public constructor(private readonly _nativeCamera: NativeCamera) {
    super();
  }

  public override get id(): number {
    return this._nativeCamera.id;
  }

  public override get remoteId(): null {
    return null;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Camera;
  }

  public override get isExists(): boolean {
    return this._nativeCamera.isAlive;
  }

  public override get handle(): number {
    return this._nativeCamera.handle;
  }

  public override destroy(): void {
    this._nativeCamera.destroy();
  }

  public get isActive(): boolean {
    return this._nativeCamera.isActive;
  }

  public setIsActive(value: boolean): void {
    this._nativeCamera.setActive(value);
  }

  public get direction(): IVector3D {
    const { x, y, z } = this._nativeCamera.direction;
    return new Vector(x, -z, y);
  }

  public get fov(): number {
    return this._nativeCamera.fov;
  }

  public setFov(value: number): void {
    this._nativeCamera.setFov(value);
  }

  public pointAtCoord(value: IVector3D): void {
    this._nativeCamera.pointAtCoord({ x: value.x, y: value.z, z: -value.y });
  }

  public setPosition(value: Vector3D): void {
    this._nativeCamera.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public get position(): Vector3D {
    const { x, y, z } = this._nativeCamera.position;
    return new Vector(x, -z, y);
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this._nativeCamera.rotation;
    return new Vector(x, -z, y);
  }

  public setRotation(value: IVector3D): void {
    this._nativeCamera.setRotation({ x: value.x, y: value.z, z: -value.y });
  }
}

const wrappers = new WeakMap<NativeCamera, RockSandboxCamera>();
export function wrapCamera(camera: NativeCamera): RockSandboxCamera {
  const old = wrappers.get(camera);
  if (old) return old;
  const wrapper = new RockSandboxCamera(camera);
  wrappers.set(camera, wrapper);
  return wrapper;
}
