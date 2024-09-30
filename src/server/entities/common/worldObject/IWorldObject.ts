import { IBaseObject, IBaseObjectOptions } from "../baseObject/IBaseObject";
import { Vector3D } from "../../../common/utils/math/Vectors";

export interface IWorldObjectOptions extends IBaseObjectOptions {}

export interface IWorldObject extends IBaseObject {
  position: Vector3D;
  dimension: number;
}
