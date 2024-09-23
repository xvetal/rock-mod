import { IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { AltVWorldObject } from "./AltVWorldObject";
import { AltVBaseObjectsIterator } from "../baseObject/AltVBaseObjectsIterator";

export class AltVWorldObjectsIterator<T extends AltVWorldObject>
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
}
