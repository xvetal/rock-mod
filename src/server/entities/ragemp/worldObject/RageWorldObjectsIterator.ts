import { RageWorldObject } from "./RageWorldObject";
import { RageBaseObjectsIterator } from "../baseObject/RageBaseObjectsIterator";
import { IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";

export class RageWorldObjectsIterator<T extends RageWorldObject>
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
}
