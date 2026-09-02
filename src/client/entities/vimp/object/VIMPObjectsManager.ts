import { type Object as CcmpObject } from "@classic-mp/types/client";
import { type CCMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPObject } from "./VIMPObject";

export class CCMPObjectsManager implements IObjectsManager {
  private readonly _objects = new Map<number, CCMPObject>();

  private readonly _objectsByRemoteId = new Map<number, CCMPObject>();

  private readonly _iterator: IWorldObjectsIterator<CCMPObject> = {
    all: (): IterableIterator<CCMPObject> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPObject> => this._filter((object) => object.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPObject> =>
      this._filter((object) => {
        const position = object.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPObject> =>
      this._filter((object) => object.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: CCMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IObjectCreateOptions): CCMPObject {
    const ccmpObject = ccmp.objects.create(options.model, options.position, options.rotation, {
      dimension: options.dimension,
      alpha: options.alpha,
    });

    if (!ccmpObject) {
      throw new Error(`CCMPObjectsManager.create: ccmp.objects.create failed for model "${options.model}"`);
    }

    return this._register(ccmpObject);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpObject of ccmp.objects.all) {
      this._register(ccmpObject);
    }
  }

  public registerById(id: number): CCMPObject {
    const existingObject = this.findByID(id);
    if (existingObject) {
      return existingObject;
    }

    const ccmpObject = ccmp.objects.getById(id);
    if (!ccmpObject) {
      throw new Error(`CCMPObjectsManager.registerById(${id}): object not found.`);
    }

    return this._register(ccmpObject);
  }

  public unregisterById(id: number): CCMPObject {
    return this.deleteById(id);
  }

  public findByID(id: number): CCMPObject | null {
    const object = this._objects.get(id) ?? null;
    if (object && !object.isExists) {
      this._unregister(object);
    } else if (object) {
      return object;
    }

    const ccmpObject = ccmp.objects.getById(id);
    if (!ccmpObject) {
      return null;
    }

    return this._register(ccmpObject);
  }

  public getByID(id: number): CCMPObject {
    const object = this.findByID(id);
    if (!object) {
      throw new Error(`CCMPObjectsManager.getByID(${id}): object not found.`);
    }
    return object;
  }

  public findByRemoteID(remoteId: number): CCMPObject | null {
    const object = this._objectsByRemoteId.get(remoteId) ?? null;
    if (object && !object.isExists) {
      this._unregister(object);
    } else if (object) {
      return object;
    }

    const ccmpObject = ccmp.objects.getByRemoteId(remoteId);
    if (!ccmpObject) {
      return null;
    }

    return this._register(ccmpObject);
  }

  public getByRemoteID(remoteId: number): CCMPObject {
    const object = this.findByRemoteID(remoteId);
    if (!object) {
      throw new Error(`CCMPObjectsManager.getByRemoteID(${remoteId}): object not found.`);
    }
    return object;
  }

  public deleteById(id: number): CCMPObject {
    const object = this.getByID(id);
    object.destroy();
    return object;
  }

  public get iterator(): IWorldObjectsIterator<CCMPObject> {
    return this._iterator;
  }

  private _register(ccmpObject: CcmpObject): CCMPObject {
    const existingObject = this._findRegistered(ccmpObject);
    if (existingObject && existingObject.isExists) {
      return existingObject;
    }
    if (existingObject) {
      this._unregister(existingObject);
    }

    const object = new CCMPObject(ccmpObject, (destroyedObject) => {
      this._unregister(destroyedObject);
    });
    this._objects.set(object.id, object);
    if (object.remoteId !== null) {
      this._objectsByRemoteId.set(object.remoteId, object);
    }
    return object;
  }

  private _unregister(object: CCMPObject): void {
    this._objects.delete(object.id);
    if (object.remoteId !== null) {
      this._objectsByRemoteId.delete(object.remoteId);
    }
  }

  private _findRegistered(ccmpObject: CcmpObject): CCMPObject | null {
    return (
      (ccmpObject.remoteId === null ? null : (this._objectsByRemoteId.get(ccmpObject.remoteId) ?? null)) ??
      this._objects.get(ccmpObject.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("objectCreated", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, object);
    });

    ccmp.on("objectDestroyed", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._findRegistered(ccmpObject) ?? this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, object);
      this._unregister(object);
    });

    ccmp.on("objectStreamIn", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, object);
    });

    ccmp.on("objectStreamOut", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._findRegistered(ccmpObject) ?? this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, object);
    });
  }

  private *_filter(predicate: (object: CCMPObject) => boolean): IterableIterator<CCMPObject> {
    for (const object of this._objects.values()) {
      if (!object.isExists) {
        this._unregister(object);
        continue;
      }

      if (predicate(object)) {
        yield object;
      }
    }
  }

  private _pruneDestroyed(): void {
    for (const object of this._objects.values()) {
      if (!object.isExists) {
        this._unregister(object);
      }
    }
  }
}
