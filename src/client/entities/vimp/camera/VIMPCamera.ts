import { BaseObjectType } from "@shared/entities";
import { type Camera as VimpCamera } from "@vimp-mp/types/client";
import { type ICamera } from "../../common/camera/ICamera";
import { type IVector3D, Vector3D } from "@shared/common/utils";

export class VIMPCamera implements ICamera {
  public constructor(private readonly _camera: VimpCamera) {}

  public get id(): number {
    return this._camera.id;
  }

  public get remoteId(): number | null {
    return null;
  }

  public get type(): BaseObjectType {
    return BaseObjectType.Camera;
  }

  public get isExists(): boolean {
    return this._camera.isAlive;
  }

  public get handle(): number {
    return this._camera.handle;
  }

  public destroy(): void {
    this._camera.destroy();
  }

  public get isActive(): boolean {
    return this._camera.isActive;
  }

  public setIsActive(value: boolean): void {
    this._camera.setActive(value);
  }

  public get direction(): IVector3D {
    const { x, y, z } = this._camera.direction;
    return new Vector3D(x, y, z);
  }

  public get fov(): number {
    return this._camera.fov;
  }

  public setFov(value: number): void {
    this._camera.setFov(value);
  }

  public pointAtCoord(value: IVector3D): void {
    this._camera.pointAtCoord(value);
  }

  public setPosition(value: Vector3D): void {
    this._camera.setPosition(value);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._camera.position;
    return new Vector3D(x, y, z);
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this._camera.rotation;
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._camera.setRotation(value);
  }
}
