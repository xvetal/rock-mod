import { type Marker as VimpMarker } from "@vimp-mp/types/client";
import { type VIMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IMarkerCreateOptions, type IMarkersManager } from "../../common/marker/IMarkersManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { VIMPMarker } from "./VIMPMarker";

export class VIMPMarkersManager implements IMarkersManager {
  private readonly _markers = new Map<number, VIMPMarker>();

  private readonly _markersByRemoteId = new Map<number, VIMPMarker>();

  private readonly _iterator: IWorldObjectsIterator<VIMPMarker> = {
    all: (): IterableIterator<VIMPMarker> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPMarker> => this._filter((marker) => marker.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPMarker> =>
      this._filter((marker) => {
        const position = marker.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPMarker> =>
      this._filter((marker) => marker.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: VIMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IMarkerCreateOptions): VIMPMarker {
    const { r, g, b, a } = options.color;
    const vimpMarker = vimp.markers.create(options.type, options.position, {
      dimension: options.dimension,
      rotation: options.rotation,
      scale: options.scale,
      color: { r, g, b, a: a ?? 255 },
    });

    if (!vimpMarker) {
      throw new Error(`VIMPMarkersManager.create: vimp.markers.create failed for marker type "${options.type}"`);
    }

    return this._register(vimpMarker);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const vimpMarker of vimp.markers.all) {
      this._register(vimpMarker);
    }
  }

  public registerById(id: number): VIMPMarker {
    const existingMarker = this.findByID(id);
    if (existingMarker) {
      return existingMarker;
    }

    const vimpMarker = vimp.markers.getById(id);
    if (!vimpMarker) {
      throw new Error(`VIMPMarkersManager.registerById(${id}): marker not found.`);
    }

    return this._register(vimpMarker);
  }

  public unregisterById(id: number): VIMPMarker {
    return this.deleteById(id);
  }

  public findByID(id: number): VIMPMarker | null {
    const marker = this._markers.get(id) ?? null;
    if (marker && !marker.isExists) {
      this._unregister(marker);
    } else if (marker) {
      return marker;
    }

    const vimpMarker = vimp.markers.getById(id);
    if (!vimpMarker) {
      return null;
    }

    return this._register(vimpMarker);
  }

  public getByID(id: number): VIMPMarker {
    const marker = this.findByID(id);
    if (!marker) {
      throw new Error(`VIMPMarkersManager.getByID(${id}): marker not found.`);
    }
    return marker;
  }

  public findByRemoteID(remoteId: number): VIMPMarker | null {
    const marker = this._markersByRemoteId.get(remoteId) ?? null;
    if (marker && !marker.isExists) {
      this._unregister(marker);
    } else if (marker) {
      return marker;
    }

    const vimpMarker = vimp.markers.getByRemoteId(remoteId);
    if (!vimpMarker) {
      return null;
    }

    return this._register(vimpMarker);
  }

  public getByRemoteID(remoteId: number): VIMPMarker {
    const marker = this.findByRemoteID(remoteId);
    if (!marker) {
      throw new Error(`VIMPMarkersManager.getByRemoteID(${remoteId}): marker not found.`);
    }
    return marker;
  }

  public deleteById(id: number): VIMPMarker {
    const marker = this.getByID(id);
    marker.destroy();
    return marker;
  }

  public get iterator(): IWorldObjectsIterator<VIMPMarker> {
    return this._iterator;
  }

  private _register(vimpMarker: VimpMarker): VIMPMarker {
    const existingMarker = this._findRegistered(vimpMarker);
    if (existingMarker && existingMarker.isExists) {
      return existingMarker;
    }
    if (existingMarker) {
      this._unregister(existingMarker);
    }

    const marker = new VIMPMarker(vimpMarker, (destroyedMarker) => {
      this._unregister(destroyedMarker);
    });
    this._markers.set(marker.id, marker);
    if (marker.remoteId !== null) {
      this._markersByRemoteId.set(marker.remoteId, marker);
    }
    return marker;
  }

  private _unregister(marker: VIMPMarker): void {
    this._markers.delete(marker.id);
    if (marker.remoteId !== null) {
      this._markersByRemoteId.delete(marker.remoteId);
    }
  }

  private _findRegistered(vimpMarker: VimpMarker): VIMPMarker | null {
    return (
      (vimpMarker.remoteId === null ? null : (this._markersByRemoteId.get(vimpMarker.remoteId) ?? null)) ??
      this._markers.get(vimpMarker.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    vimp.on("markerCreated", (vimpMarker: VimpMarker | null) => {
      if (!vimpMarker) return;
      const marker = this._register(vimpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, marker);
    });

    vimp.on("markerDestroyed", (vimpMarker: VimpMarker | null) => {
      if (!vimpMarker) return;
      const marker = this._findRegistered(vimpMarker) ?? this._register(vimpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, marker);
      this._unregister(marker);
    });

    vimp.on("markerStreamIn", (vimpMarker: VimpMarker | null) => {
      if (!vimpMarker) return;
      const marker = this._register(vimpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, marker);
    });

    vimp.on("markerStreamOut", (vimpMarker: VimpMarker | null) => {
      if (!vimpMarker) return;
      const marker = this._findRegistered(vimpMarker) ?? this._register(vimpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, marker);
    });
  }

  private *_filter(predicate: (marker: VIMPMarker) => boolean): IterableIterator<VIMPMarker> {
    for (const marker of this._markers.values()) {
      if (!marker.isExists) {
        this._unregister(marker);
        continue;
      }

      if (predicate(marker)) {
        yield marker;
      }
    }
  }

  private _pruneDestroyed(): void {
    for (const marker of this._markers.values()) {
      if (!marker.isExists) {
        this._unregister(marker);
      }
    }
  }
}
