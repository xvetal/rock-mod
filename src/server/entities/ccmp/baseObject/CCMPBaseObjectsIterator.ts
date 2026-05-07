import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type CCMPBaseObject } from "./CCMPBaseObject";

export class CCMPBaseObjectsIterator<T extends CCMPBaseObject> implements IBaseObjectsIterator<T> {
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
