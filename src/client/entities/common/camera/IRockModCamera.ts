import type { IBaseObject, IWorldObjectOptions } from "@RockMod/client/entities";
import { type IVector3D, type Vector3D } from "@shared/common/utils";

export interface ICameraOptions extends IWorldObjectOptions {}

export interface IRockModCamera extends IBaseObject {
  get isActive(): boolean;
  setIsActive(value: boolean): void;
  get direction(): IVector3D;
  get fov(): number;
  setFov(value: number): void;
  pointAtCoord(value: IVector3D): void;
  setPosition(value: Vector3D): void;
  get position(): Vector3D;
  get rotation(): IVector3D;
  setRotation(value: IVector3D): void;
}
