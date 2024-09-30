import { RageWorldObject } from "./RageWorldObject";
import { RageBaseObjectsIterator } from "../baseObject/RageBaseObjectsIterator";
import { IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { Vector2D, Vector3D } from "../../../common/utils/math/Vectors";

export class RageWorldObjectsIterator<T extends RageWorldObject<EntityMp>>
  extends RageBaseObjectsIterator<T>
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
      const { position } = worldObject;
      const distanceSquared =
        (center.x - position.x) * (center.x - position.x) + (center.y - position.y) * (center.y - position.y);

      if (distanceSquared <= rangeSquared) {
        yield worldObject;
      }
    }
  }

  public *range3D(center: Vector3D, range: number): IterableIterator<T> {
    const rangeSquared = range * range;

    for (const worldObject of this.all()) {
      const { position } = worldObject;
      const distanceSquared =
        (center.x - position.x) * (center.x - position.x) +
        (center.y - position.y) * (center.y - position.y) +
        (center.z - position.z) * (center.z - position.z);

      if (distanceSquared <= rangeSquared) {
        yield worldObject;
      }
    }
  }
}
