import { IBaseObject, IBaseObjectOptions } from "../baseObject/IBaseObject";
import { Vector3D } from "../../../common/utils/math/Vector3D";

export interface IWorldObjectOptions extends IBaseObjectOptions {
  position: Vector3D;
  dimension: number;
}

export interface IWorldObject extends IBaseObject {
  position: Vector3D;
  dimension: number;
}
