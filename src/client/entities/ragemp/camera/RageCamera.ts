import type { ICamera } from "@RockMod/client/entities";
import { type IVector3D, Vector3D } from "@shared/index";
import { type IRageBaseObjectOptions, RageBaseObject } from "@RockMod/client/entities/ragemp/baseObject/RageBaseObject";

export interface IRageCameraOptions extends IRageBaseObjectOptions<EntityMp> {}

export class RageCamera extends RageBaseObject implements ICamera {
  public constructor(options: IRageCameraOptions) {
    super(options);
  }

  private get _cameraEntity(): CameraMp {
    return this.mpEntity as unknown as CameraMp;
  }

  public get isActive(): boolean {
    return this._cameraEntity.isActive();
  }

  public setIsActive(value: boolean): void {
    this._cameraEntity.setActive(value);
  }

  public get direction(): IVector3D {
    const { x, y, z } = this._cameraEntity.getDirection();
    return new Vector3D(x, y, z);
  }

  public get fov(): number {
    return this._cameraEntity.getFov();
  }

  public setFov(value: number): void {
    this._cameraEntity.setFov(value);
  }

  public pointAtCoord(value: IVector3D): void {
    this._cameraEntity.pointAtCoord(value.x, value.y, value.z);
  }

  public setPosition(value: Vector3D): void {
    this._cameraEntity.setCoord(value.x, value.y, value.z);
  }

  public get position(): Vector3D {
    const { x, y, z } = this._cameraEntity.getCoord();
    return new Vector3D(x, y, z);
  }

  public get rotation(): IVector3D {
    const { x, y, z } = this._cameraEntity.getRot(2);
    return new Vector3D(x, y, z);
  }

  public setRotation(value: IVector3D): void {
    this._cameraEntity.setRot(value.x, value.y, value.z, 2);
  }
}
