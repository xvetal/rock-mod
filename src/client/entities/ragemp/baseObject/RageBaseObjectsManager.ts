import { type IBaseObjectsManager, type IBaseObjectsManagerOptions } from "../../common/baseObject/IBaseObjectsManager";
import { type RageBaseObject } from "./RageBaseObject";
import { RageBaseObjectsIterator } from "./RageBaseObjectsIterator";
import { RockMod } from "../../../RockMod";
import { type BaseObjectType } from "@shared/entities";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";

export interface IRageBaseObjectsManagerOptions extends IBaseObjectsManagerOptions {}

export abstract class RageBaseObjectsManager<T extends RageBaseObject<EntityMp>>
  implements IBaseObjectsManager<RageBaseObject<EntityMp>>
{
  private readonly _baseObjects: Map<number, T>;

  private readonly _baseObjectsType: `${BaseObjectType}`;

  protected readonly _iterator: RageBaseObjectsIterator<T>;

  protected get baseObjects(): ReadonlyMap<number, T> {
    return this._baseObjects;
  }

  public get iterator(): RageBaseObjectsIterator<T> {
    return this._iterator;
  }

  protected constructor(options: IRageBaseObjectsManagerOptions) {
    this._baseObjects = new Map();
    this._baseObjectsType = options.baseObjectsType;
    this._iterator = new RageBaseObjectsIterator(this._baseObjects);

    mp.events.add("entityDestroyed", (mpEntity) => {
      if (mpEntity.type === this._baseObjectsType) {
        const baseObject = this.findByID(mpEntity.id);
        if (!baseObject) {
          return;
        }
        this.unregisterBaseObject(baseObject);
      }
    });
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

  public getByRemoteID(remoteId: number): T {
    const baseObject = this.findByRemoteID(remoteId);

    if (!baseObject) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${remoteId} not found`);
    }

    return baseObject;
  }

  public findByRemoteID(remoteId: number): T | null {
    const baseObject = Array.from(this._baseObjects.values()).find((obj) => obj.remoteId === remoteId);

    return baseObject ?? null;
  }

  public deleteById(id: number): T {
    const object = this.getByID(id);

    object.destroy();
    this.unregisterBaseObject(object);

    return object;
  }

  protected registerBaseObject(baseObject: T): void {
    if (this._baseObjects.has(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} already exists`);
    }
    this._baseObjects.set(baseObject.id, baseObject);

    RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityCreated, baseObject);
  }

  protected unregisterBaseObject(baseObject: T): void {
    if (!this._baseObjects.delete(baseObject.id)) {
      throw new Error(`BaseObject [${this._baseObjectsType}] with id ${baseObject.id} not found`);
    }

    RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityDestroyed, baseObject);
  }
}
