import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type VIMPBaseObject } from "./VIMPBaseObject";

export class VIMPBaseObjectsIterator<T extends VIMPBaseObject> implements IBaseObjectsIterator<T> {
  private readonly _baseObjects: ReadonlyMap<number, T>;

  public constructor(baseObjects: ReadonlyMap<number, T>) {
    this._baseObjects = baseObjects;
  }

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  public all(): IterableIterator<T> {
    return this._baseObjects.values();
  }
}
