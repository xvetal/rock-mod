import { IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { RageBaseObject } from "./RageBaseObject";

export class RageBaseObjectsIterator<T extends RageBaseObject> implements IBaseObjectsIterator<T> {
  private readonly _baseObjects: ReadonlyMap<number, T>;

  public constructor(baseObjects: ReadonlyMap<number, T>) {
    this._baseObjects = baseObjects;
  }

  public all(): IterableIterator<T> {
    return this._baseObjects.values();
  }
}
