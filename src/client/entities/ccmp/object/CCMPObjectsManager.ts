import { type Object as CcmpObject } from "@classic-mp/types/client";
import { type CCMPEventsManager } from "@RockMod/client/net/ccmp/events/CCMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPObject } from "./CCMPObject";

export class CCMPObjectsManager implements IObjectsManager {
  private readonly _objects = new Map<number, CCMPObject>();

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
    void options;
    throw new Error(
      "CCMPObjectsManager.create: client-side object creation is not supported by CCMP. Use server-side ccmp.objects.create.",
    );
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpObject of ccmp.objects.all) {
      if (!this._objects.has(ccmpObject.id)) {
        this._register(ccmpObject);
      }
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
      this._objects.delete(id);
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
    return this.findByID(remoteId);
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
    const existingObject = this._objects.get(ccmpObject.id) ?? null;
    if (existingObject && existingObject.isExists) {
      return existingObject;
    }

    const object = new CCMPObject(ccmpObject, (destroyedObject) => {
      this._objects.delete(destroyedObject.id);
    });
    this._objects.set(object.id, object);
    return object;
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("objectCreated", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, object);
    });

    ccmp.on("objectDestroyed", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._objects.get(ccmpObject.id) ?? this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, object);
      this._objects.delete(object.id);
    });

    ccmp.on("objectStreamIn", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, object);
    });

    ccmp.on("objectStreamOut", (ccmpObject: CcmpObject | null) => {
      if (!ccmpObject) return;
      const object = this._objects.get(ccmpObject.id) ?? this._register(ccmpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, object);
    });
  }

  private *_filter(predicate: (object: CCMPObject) => boolean): IterableIterator<CCMPObject> {
    for (const object of this._objects.values()) {
      if (!object.isExists) {
        this._objects.delete(object.id);
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
        this._objects.delete(object.id);
      }
    }
  }
}
