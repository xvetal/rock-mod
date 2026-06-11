import { type Marker as CcmpMarker } from "@classic-mp/types/client";
import { type CCMPEventsManager } from "@RockMod/client/net/ccmp/events/CCMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IMarkerCreateOptions, type IMarkersManager } from "../../common/marker/IMarkersManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPMarker } from "./CCMPMarker";

export class CCMPMarkersManager implements IMarkersManager {
  private readonly _markers = new Map<number, CCMPMarker>();

  private readonly _markersByRemoteId = new Map<number, CCMPMarker>();

  private readonly _iterator: IWorldObjectsIterator<CCMPMarker> = {
    all: (): IterableIterator<CCMPMarker> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPMarker> => this._filter((marker) => marker.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPMarker> =>
      this._filter((marker) => {
        const position = marker.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPMarker> =>
      this._filter((marker) => marker.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: CCMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IMarkerCreateOptions): CCMPMarker {
    const { r, g, b, a } = options.color;
    const ccmpMarker = ccmp.markers.create(options.type, options.position, {
      dimension: options.dimension,
      rotation: options.rotation,
      scale: options.scale,
      color: { r, g, b, a: a ?? 255 },
    });

    if (!ccmpMarker) {
      throw new Error(`CCMPMarkersManager.create: ccmp.markers.create failed for marker type "${options.type}"`);
    }

    return this._register(ccmpMarker);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpMarker of ccmp.markers.all) {
      this._register(ccmpMarker);
    }
  }

  public registerById(id: number): CCMPMarker {
    const existingMarker = this.findByID(id);
    if (existingMarker) {
      return existingMarker;
    }

    const ccmpMarker = ccmp.markers.getById(id);
    if (!ccmpMarker) {
      throw new Error(`CCMPMarkersManager.registerById(${id}): marker not found.`);
    }

    return this._register(ccmpMarker);
  }

  public unregisterById(id: number): CCMPMarker {
    return this.deleteById(id);
  }

  public findByID(id: number): CCMPMarker | null {
    const marker = this._markers.get(id) ?? null;
    if (marker && !marker.isExists) {
      this._unregister(marker);
    } else if (marker) {
      return marker;
    }

    const ccmpMarker = ccmp.markers.getById(id);
    if (!ccmpMarker) {
      return null;
    }

    return this._register(ccmpMarker);
  }

  public getByID(id: number): CCMPMarker {
    const marker = this.findByID(id);
    if (!marker) {
      throw new Error(`CCMPMarkersManager.getByID(${id}): marker not found.`);
    }
    return marker;
  }

  public findByRemoteID(remoteId: number): CCMPMarker | null {
    const marker = this._markersByRemoteId.get(remoteId) ?? null;
    if (marker && !marker.isExists) {
      this._unregister(marker);
    } else if (marker) {
      return marker;
    }

    const ccmpMarker = ccmp.markers.getByRemoteId(remoteId);
    if (!ccmpMarker) {
      return null;
    }

    return this._register(ccmpMarker);
  }

  public getByRemoteID(remoteId: number): CCMPMarker {
    const marker = this.findByRemoteID(remoteId);
    if (!marker) {
      throw new Error(`CCMPMarkersManager.getByRemoteID(${remoteId}): marker not found.`);
    }
    return marker;
  }

  public deleteById(id: number): CCMPMarker {
    const marker = this.getByID(id);
    marker.destroy();
    return marker;
  }

  public get iterator(): IWorldObjectsIterator<CCMPMarker> {
    return this._iterator;
  }

  private _register(ccmpMarker: CcmpMarker): CCMPMarker {
    const existingMarker = this._findRegistered(ccmpMarker);
    if (existingMarker && existingMarker.isExists) {
      return existingMarker;
    }
    if (existingMarker) {
      this._unregister(existingMarker);
    }

    const marker = new CCMPMarker(ccmpMarker, (destroyedMarker) => {
      this._unregister(destroyedMarker);
    });
    this._markers.set(marker.id, marker);
    if (marker.remoteId !== null) {
      this._markersByRemoteId.set(marker.remoteId, marker);
    }
    return marker;
  }

  private _unregister(marker: CCMPMarker): void {
    this._markers.delete(marker.id);
    if (marker.remoteId !== null) {
      this._markersByRemoteId.delete(marker.remoteId);
    }
  }

  private _findRegistered(ccmpMarker: CcmpMarker): CCMPMarker | null {
    return (
      (ccmpMarker.remoteId === null ? null : (this._markersByRemoteId.get(ccmpMarker.remoteId) ?? null)) ??
      this._markers.get(ccmpMarker.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("markerCreated", (ccmpMarker: CcmpMarker | null) => {
      if (!ccmpMarker) return;
      const marker = this._register(ccmpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, marker);
    });

    ccmp.on("markerDestroyed", (ccmpMarker: CcmpMarker | null) => {
      if (!ccmpMarker) return;
      const marker = this._findRegistered(ccmpMarker) ?? this._register(ccmpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, marker);
      this._unregister(marker);
    });

    ccmp.on("markerStreamIn", (ccmpMarker: CcmpMarker | null) => {
      if (!ccmpMarker) return;
      const marker = this._register(ccmpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, marker);
    });

    ccmp.on("markerStreamOut", (ccmpMarker: CcmpMarker | null) => {
      if (!ccmpMarker) return;
      const marker = this._findRegistered(ccmpMarker) ?? this._register(ccmpMarker);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, marker);
    });
  }

  private *_filter(predicate: (marker: CCMPMarker) => boolean): IterableIterator<CCMPMarker> {
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
