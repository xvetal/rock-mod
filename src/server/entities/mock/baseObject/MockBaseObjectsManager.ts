import { IBaseObjectsManager, IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { MockBaseObject } from "./MockBaseObject";
import { MockBaseObjectsIterator } from "./MockBaseObjectsIterator";
import { RockMod } from "../../../RockMod";
import { BaseObjectType } from "../../../../shared";
import { ServerInternalEventName } from "@RockMod/server/net/common/events/types";

export interface IMockBaseObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export abstract class MockBaseObjectsManager<T extends MockBaseObject> implements IBaseObjectsManager<T> {
  protected readonly _baseObjects: Map<number, T>;

  protected readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: MockBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  public get iterator(): MockBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IMockBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new MockBaseObjectsIterator(this._baseObjects);
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
