import { type IBaseObjectsIterator } from "../baseObject/IBaseObjectsIterator";
import { type IWorldObject } from "./IWorldObject";
import { type Vector2D, type Vector3D } from "@shared/common/utils";

export interface IWorldObjectsIterator<T extends IWorldObject> extends IBaseObjectsIterator<T> {
  dimension(value: number): IterableIterator<T>;
  range2D(center: Vector2D, range: number): IterableIterator<T>;
  range3D(center: Vector3D, range: number): IterableIterator<T>;
}
