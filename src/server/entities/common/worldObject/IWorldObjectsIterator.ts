import { IBaseObjectsIterator } from "../baseObject/IBaseObjectsIterator";
import { IWorldObject } from "./IWorldObject";
import { Vector2D, Vector3D } from "../../../common/utils/math/Vectors";

export interface IWorldObjectsIterator<T extends IWorldObject> extends IBaseObjectsIterator<T> {
  dimension(value: number): IterableIterator<T>;
  range2D(center: Vector2D, range: number): IterableIterator<T>;
  range3D(center: Vector3D, range: number): IterableIterator<T>;
}
