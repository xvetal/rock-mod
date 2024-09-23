import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { BaseObjectType } from "../../common/baseObject/IBaseObject";
import { AltVBaseObject } from "./AltVBaseObject";

export abstract class AltVBaseObjectsManager<T extends AltVBaseObject> implements IBaseObjectsManager<T> {
  protected readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected constructor(options: IBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
  }

  public getByID(id: number): T {
    const entity = this._baseObjects.get(id);

    if (!entity) {
      throw new Error(`BaseObject ${this._baseObjectsType} #${id} not found`);
    }

    return entity;
  }
}
