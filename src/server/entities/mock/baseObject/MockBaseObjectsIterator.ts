import { type IBaseObjectsIterator } from "../../common/baseObject/IBaseObjectsIterator";
import { type MockBaseObject } from "./MockBaseObject";

export class MockBaseObjectsIterator<T extends MockBaseObject> implements IBaseObjectsIterator<T> {
  protected readonly _baseObjects: ReadonlyMap<number, T>;

  public constructor(baseObjects: ReadonlyMap<number, T>) {
    this._baseObjects = baseObjects;
  }

  public all(): IterableIterator<T> {
    return this._baseObjects.values();
  }
}
