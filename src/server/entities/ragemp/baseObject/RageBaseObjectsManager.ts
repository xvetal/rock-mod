import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { RageBaseObject } from "./RageBaseObject";
import { BaseObjectType } from "../../common/baseObject/IBaseObject";

export abstract class RageBaseObjectsManager<T extends RageBaseObject> implements IBaseObjectsManager<RageBaseObject> {
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
