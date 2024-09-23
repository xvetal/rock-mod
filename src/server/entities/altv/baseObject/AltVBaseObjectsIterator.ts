import { AltVBaseObject } from "./AltVBaseObject";
import { IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";

export class AltVBaseObjectsIterator<T extends AltVBaseObject> implements IBaseObjectsIterator<T> {
  private readonly _baseObjects: ReadonlyMap<number, T>;

  public constructor(baseObjects: ReadonlyMap<number, T>) {
    this._baseObjects = baseObjects;
  }

  public all(): IterableIterator<T> {
    return this._baseObjects.values();
  }
}
