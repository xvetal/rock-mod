import { type IBaseObjectsManager, type IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { type VIMPBaseObject } from "./VIMPBaseObject";
import { VIMPBaseObjectsIterator } from "./VIMPBaseObjectsIterator";
import { type BaseObjectType } from "../../../../shared";
import { RockMod } from "../../../RockMod";
import { ServerInternalEventName } from "../../../net/common/events/types";

export interface IVIMPBaseObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export abstract class VIMPBaseObjectsManager<T extends VIMPBaseObject> implements IBaseObjectsManager<T> {
  private readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: VIMPBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  protected get baseObjectsType(): `${BaseObjectType}` {
    return this._baseObjectsType;
  }

  public get iterator(): VIMPBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IVIMPBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new VIMPBaseObjectsIterator(this._baseObjects);
  }

  public getByID(id: number): T {
    const baseObject = this.findByID(id);

    if (!baseObject) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${id} not found`);
    }

    return baseObject;
  }

  public findByID(id: number): T | null {
    return this._baseObjects.get(id) ?? null;
  }

  protected registerBaseObject(baseObject: T): void {
    if (this._baseObjects.has(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} already exists`);
    }
    this._baseObjects.set(baseObject.id, baseObject);
    RockMod.instance.net.events.emitInternal(ServerInternalEventName.EntityCreated, baseObject);
  }

  protected unregisterBaseObject(baseObject: T): void {
    if (!this._baseObjects.delete(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} not found`);
    }
    RockMod.instance.net.events.emitInternal(ServerInternalEventName.EntityDestroyed, baseObject);
  }
}
