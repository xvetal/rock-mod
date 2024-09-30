import { IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { AltVWorldObject } from "./AltVWorldObject";
import { AltVBaseObjectsIterator } from "../baseObject/AltVBaseObjectsIterator";
import { Vector2D, Vector3D } from "../../../common/utils/math/Vectors";
import WorldObject = AltVServer.WorldObject;

export class AltVWorldObjectsIterator<T extends AltVWorldObject<WorldObject>>
  extends AltVBaseObjectsIterator<T>
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
    for (const worldObject of this.all()) {
      const { position } = worldObject;
      const isInRange = center.isInRange(position, range);

      if (isInRange) {
        yield worldObject;
      }
    }
  }

  public *range3D(center: Vector3D, range: number): IterableIterator<T> {
    for (const worldObject of this.all()) {
      const { position } = worldObject;
      const isInRange = center.isInRange(position, range);

      if (isInRange) {
        yield worldObject;
      }
    }
  }
}
