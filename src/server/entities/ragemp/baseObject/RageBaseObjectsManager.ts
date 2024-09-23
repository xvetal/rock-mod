import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { RageBaseObject } from "./RageBaseObject";
import { BaseObjectType } from "../../common/baseObject/IBaseObject";
import { RageBaseObjectsIterator } from "./RageBaseObjectsIterator";

export abstract class RageBaseObjectsManager<T extends RageBaseObject> implements IBaseObjectsManager<RageBaseObject> {
  private readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: RageBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  public get iterator(): RageBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new RageBaseObjectsIterator(this._baseObjects);
  }

  public getByID(id: number): T {
    const baseObject = this.findByID(id);

    if (!baseObject) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${id} not found`);
    }

    return baseObject;
  }

  public findByID(id: number): T | null {
    const baseObject = this._baseObjects.get(id);

    return baseObject ?? null;
  }
}
