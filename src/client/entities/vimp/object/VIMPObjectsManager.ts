import { type Object as VimpObject } from "@vimp-mp/types/client";
import { type VIMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IObjectCreateOptions, type IObjectsManager } from "../../common/object/IObjectsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { VIMPObject } from "./VIMPObject";

export class VIMPObjectsManager implements IObjectsManager {
  private readonly _objects = new Map<number, VIMPObject>();

  private readonly _objectsByRemoteId = new Map<number, VIMPObject>();

  private readonly _iterator: IWorldObjectsIterator<VIMPObject> = {
    all: (): IterableIterator<VIMPObject> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPObject> => this._filter((object) => object.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPObject> =>
      this._filter((object) => {
        const position = object.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPObject> =>
      this._filter((object) => object.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: VIMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IObjectCreateOptions): VIMPObject {
    const vimpObject = vimp.objects.create(options.model, options.position, options.rotation, {
      dimension: options.dimension,
      alpha: options.alpha,
    });

    if (!vimpObject) {
      throw new Error(`VIMPObjectsManager.create: vimp.objects.create failed for model "${options.model}"`);
    }

    return this._register(vimpObject);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const vimpObject of vimp.objects.all) {
      this._register(vimpObject);
    }
  }

  public registerById(id: number): VIMPObject {
    const existingObject = this.findByID(id);
    if (existingObject) {
      return existingObject;
    }

    const vimpObject = vimp.objects.getById(id);
    if (!vimpObject) {
      throw new Error(`VIMPObjectsManager.registerById(${id}): object not found.`);
    }

    return this._register(vimpObject);
  }

  public unregisterById(id: number): VIMPObject {
    return this.deleteById(id);
  }

  public findByID(id: number): VIMPObject | null {
    const object = this._objects.get(id) ?? null;
    if (object && !object.isExists) {
      this._unregister(object);
    } else if (object) {
      return object;
    }

    const vimpObject = vimp.objects.getById(id);
    if (!vimpObject) {
      return null;
    }

    return this._register(vimpObject);
  }

  public getByID(id: number): VIMPObject {
    const object = this.findByID(id);
    if (!object) {
      throw new Error(`VIMPObjectsManager.getByID(${id}): object not found.`);
    }
    return object;
  }

  public findByRemoteID(remoteId: number): VIMPObject | null {
    const object = this._objectsByRemoteId.get(remoteId) ?? null;
    if (object && !object.isExists) {
      this._unregister(object);
    } else if (object) {
      return object;
    }

    const vimpObject = vimp.objects.getByRemoteId(remoteId);
    if (!vimpObject) {
      return null;
    }

    return this._register(vimpObject);
  }

  public getByRemoteID(remoteId: number): VIMPObject {
    const object = this.findByRemoteID(remoteId);
    if (!object) {
      throw new Error(`VIMPObjectsManager.getByRemoteID(${remoteId}): object not found.`);
    }
    return object;
  }

  public deleteById(id: number): VIMPObject {
    const object = this.getByID(id);
    object.destroy();
    return object;
  }

  public get iterator(): IWorldObjectsIterator<VIMPObject> {
    return this._iterator;
  }

  private _register(vimpObject: VimpObject): VIMPObject {
    const existingObject = this._findRegistered(vimpObject);
    if (existingObject && existingObject.isExists) {
      return existingObject;
    }
    if (existingObject) {
      this._unregister(existingObject);
    }

    const object = new VIMPObject(vimpObject, (destroyedObject) => {
      this._unregister(destroyedObject);
    });
    this._objects.set(object.id, object);
    if (object.remoteId !== null) {
      this._objectsByRemoteId.set(object.remoteId, object);
    }
    return object;
  }

  private _unregister(object: VIMPObject): void {
    this._objects.delete(object.id);
    if (object.remoteId !== null) {
      this._objectsByRemoteId.delete(object.remoteId);
    }
  }

  private _findRegistered(vimpObject: VimpObject): VIMPObject | null {
    return (
      (vimpObject.remoteId === null ? null : (this._objectsByRemoteId.get(vimpObject.remoteId) ?? null)) ??
      this._objects.get(vimpObject.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    vimp.on("objectCreated", (vimpObject: VimpObject | null) => {
      if (!vimpObject) return;
      const object = this._register(vimpObject);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, object);
    });

    vimp.on("objectDestroyed", (vimpObject: VimpObject | null) => {
      if (!vimpObject) return;
      const object = this._findRegistered(vimpObject) ?? this._register(vimpObject);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, object);
      this._unregister(object);
    });

    vimp.on("objectStreamIn", (vimpObject: VimpObject | null) => {
      if (!vimpObject) return;
      const object = this._register(vimpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, object);
    });

    vimp.on("objectStreamOut", (vimpObject: VimpObject | null) => {
      if (!vimpObject) return;
      const object = this._findRegistered(vimpObject) ?? this._register(vimpObject);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, object);
    });
  }

  private *_filter(predicate: (object: VIMPObject) => boolean): IterableIterator<VIMPObject> {
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
