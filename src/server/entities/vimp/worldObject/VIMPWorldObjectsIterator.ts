import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { type VIMPWorldObject } from "./VIMPWorldObject";
import { VIMPBaseObjectsIterator } from "../baseObject/VIMPBaseObjectsIterator";
import { type Vector2D, type Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class VIMPWorldObjectsIterator<T extends VIMPWorldObject>
  extends VIMPBaseObjectsIterator<T>
  implements IWorldObjectsIterator<T>
{
  public constructor(baseObjects: ReadonlyMap<number, T>) {
    super(baseObjects);
  }

  public *dimension(value: number): IterableIterator<T> {
    for (const worldObject of this.all()) {
      if (worldObject.dimension === value) {
        yield worldObject;
      }
    }
  }

  public *range2D(center: Vector2D, range: number): IterableIterator<T> {
    const rangeSquared = range * range;

    for (const worldObject of this.all()) {
      const { x, y } = worldObject.position;
      const dx = center.x - x;
      const dy = center.y - y;

      if (dx * dx + dy * dy <= rangeSquared) {
        yield worldObject;
      }
    }
  }

  public *range3D(center: Vector3D, range: number): IterableIterator<T> {
    const rangeSquared = range * range;

    for (const worldObject of this.all()) {
      const { x, y, z } = worldObject.position;
      const dx = center.x - x;
      const dy = center.y - y;
      const dz = center.z - z;

      if (dx * dx + dy * dy + dz * dz <= rangeSquared) {
        yield worldObject;
      }
    }
  }
}
