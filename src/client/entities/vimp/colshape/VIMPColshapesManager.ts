import { type Colshape as VimpColshape } from "@vimp-mp/types/client";
import { type VIMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { VIMPColshape } from "./VIMPColshape";

export class VIMPColshapesManager implements IColshapesManager {
  private readonly _colshapes = new Map<number, VIMPColshape>();

  private readonly _colshapesByRemoteId = new Map<number, VIMPColshape>();

  private readonly _iterator: IWorldObjectsIterator<VIMPColshape> = {
    all: (): IterableIterator<VIMPColshape> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPColshape> =>
      this._filter((colshape) => colshape.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPColshape> =>
      this._filter((colshape) => {
        const position = colshape.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPColshape> =>
      this._filter((colshape) => colshape.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: VIMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public createCircle(options: ICircleColshapeCreateOptions): VIMPColshape {
    const vimpColshape = vimp.colshapes.createCircle(options.position, options.range, {
      dimension: options.dimension,
    });
    return this._register(vimpColshape);
  }

  public createCuboid(options: ICuboidColshapeCreateOptions): VIMPColshape {
    const vimpColshape = vimp.colshapes.createCuboid(
      options.position,
      { x: options.width, y: options.depth, z: options.height },
      { dimension: options.dimension },
    );
    return this._register(vimpColshape);
  }

  public createCylinder(options: ICylinderColshapeCreateOptions): VIMPColshape {
    const vimpColshape = vimp.colshapes.createCylinder(options.position, options.range, options.height, {
      dimension: options.dimension,
    });
    return this._register(vimpColshape);
  }

  public createRectangle(options: IRectangleColshapeCreateOptions): VIMPColshape {
    void options;
    throw new Error("VIMPColshapesManager.createRectangle: not supported by VIMP");
  }

  public createSphere(options: ISphereColshapeCreateOptions): VIMPColshape {
    const vimpColshape = vimp.colshapes.createSphere(options.position, options.range, {
      dimension: options.dimension,
    });
    return this._register(vimpColshape);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const vimpColshape of vimp.colshapes.all) {
      this._register(vimpColshape);
    }
  }

  public registerById(id: number): VIMPColshape {
    const existingColshape = this.findByID(id);
    if (existingColshape) {
      return existingColshape;
    }

    const vimpColshape = vimp.colshapes.getById(id);
    if (!vimpColshape) {
      throw new Error(`VIMPColshapesManager.registerById(${id}): colshape not found.`);
    }

    return this._register(vimpColshape);
  }

  public unregisterById(id: number): VIMPColshape {
    return this.deleteById(id);
  }

  public findByID(id: number): VIMPColshape | null {
    const colshape = this._colshapes.get(id) ?? null;
    if (colshape && !colshape.isExists) {
      this._unregister(colshape);
    } else if (colshape) {
      return colshape;
    }

    const vimpColshape = vimp.colshapes.getById(id);
    if (!vimpColshape) {
      return null;
    }

    return this._register(vimpColshape);
  }

  public getByID(id: number): VIMPColshape {
    const colshape = this.findByID(id);
    if (!colshape) {
      throw new Error(`VIMPColshapesManager.getByID(${id}): colshape not found.`);
    }
    return colshape;
  }

  public findByRemoteID(remoteId: number): VIMPColshape | null {
    const colshape = this._colshapesByRemoteId.get(remoteId) ?? null;
    if (colshape && !colshape.isExists) {
      this._unregister(colshape);
    } else if (colshape) {
      return colshape;
    }

    const vimpColshape = vimp.colshapes.getByRemoteId(remoteId);
    if (!vimpColshape) {
      return null;
    }

    return this._register(vimpColshape);
  }

  public getByRemoteID(remoteId: number): VIMPColshape {
    const colshape = this.findByRemoteID(remoteId);
    if (!colshape) {
      throw new Error(`VIMPColshapesManager.getByRemoteID(${remoteId}): colshape not found.`);
    }
    return colshape;
  }

  public deleteById(id: number): VIMPColshape {
    const colshape = this.getByID(id);
    colshape.destroy();
    return colshape;
  }

  public get iterator(): IWorldObjectsIterator<VIMPColshape> {
    return this._iterator;
  }

  private _register(vimpColshape: VimpColshape): VIMPColshape {
    const existingColshape = this._findRegistered(vimpColshape);
    if (existingColshape && existingColshape.isExists) {
      return existingColshape;
    }
    if (existingColshape) {
      this._unregister(existingColshape);
    }

    const colshape = new VIMPColshape(vimpColshape, (destroyedColshape) => {
      this._unregister(destroyedColshape);
    });
    this._colshapes.set(colshape.id, colshape);
    if (colshape.remoteId !== null) {
      this._colshapesByRemoteId.set(colshape.remoteId, colshape);
    }
    return colshape;
  }

  private _unregister(colshape: VIMPColshape): void {
    this._colshapes.delete(colshape.id);
    if (colshape.remoteId !== null) {
      this._colshapesByRemoteId.delete(colshape.remoteId);
    }
  }

  private _findRegistered(vimpColshape: VimpColshape): VIMPColshape | null {
    return (
      (vimpColshape.remoteId === null ? null : (this._colshapesByRemoteId.get(vimpColshape.remoteId) ?? null)) ??
      this._colshapes.get(vimpColshape.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    vimp.on("colshapeCreated", (vimpColshape: VimpColshape | null) => {
      if (!vimpColshape) return;
      const colshape = this._register(vimpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, colshape);
    });

    vimp.on("colshapeDestroyed", (vimpColshape: VimpColshape | null) => {
      if (!vimpColshape) return;
      const colshape = this._findRegistered(vimpColshape) ?? this._register(vimpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, colshape);
      this._unregister(colshape);
    });

    vimp.on("colshapeStreamIn", (vimpColshape: VimpColshape | null) => {
      if (!vimpColshape) return;
      const colshape = this._register(vimpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, colshape);
    });

    vimp.on("colshapeStreamOut", (vimpColshape: VimpColshape | null) => {
      if (!vimpColshape) return;
      const colshape = this._findRegistered(vimpColshape) ?? this._register(vimpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, colshape);
    });
  }

  private *_filter(predicate: (colshape: VIMPColshape) => boolean): IterableIterator<VIMPColshape> {
    for (const colshape of this._colshapes.values()) {
      if (!colshape.isExists) {
        this._unregister(colshape);
        continue;
      }

      if (predicate(colshape)) {
        yield colshape;
      }
    }
  }

  private _pruneDestroyed(): void {
    for (const colshape of this._colshapes.values()) {
      if (!colshape.isExists) {
        this._unregister(colshape);
      }
    }
  }
}
