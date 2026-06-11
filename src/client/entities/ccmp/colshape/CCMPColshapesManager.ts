import { type Colshape as CcmpColshape } from "@classic-mp/types/client";
import { type CCMPEventsManager } from "@RockMod/client/net/ccmp/events/CCMPEventsManager";
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
import { CCMPColshape } from "./CCMPColshape";

export class CCMPColshapesManager implements IColshapesManager {
  private readonly _colshapes = new Map<number, CCMPColshape>();

  private readonly _colshapesByRemoteId = new Map<number, CCMPColshape>();

  private readonly _iterator: IWorldObjectsIterator<CCMPColshape> = {
    all: (): IterableIterator<CCMPColshape> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPColshape> =>
      this._filter((colshape) => colshape.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPColshape> =>
      this._filter((colshape) => {
        const position = colshape.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPColshape> =>
      this._filter((colshape) => colshape.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: CCMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public createCircle(options: ICircleColshapeCreateOptions): CCMPColshape {
    const ccmpColshape = ccmp.colshapes.createCircle(options.position, options.range, {
      dimension: options.dimension,
    });
    return this._register(ccmpColshape);
  }

  public createCuboid(options: ICuboidColshapeCreateOptions): CCMPColshape {
    const ccmpColshape = ccmp.colshapes.createCuboid(
      options.position,
      { x: options.width, y: options.depth, z: options.height },
      { dimension: options.dimension },
    );
    return this._register(ccmpColshape);
  }

  public createCylinder(options: ICylinderColshapeCreateOptions): CCMPColshape {
    const ccmpColshape = ccmp.colshapes.createCylinder(options.position, options.range, options.height, {
      dimension: options.dimension,
    });
    return this._register(ccmpColshape);
  }

  public createRectangle(options: IRectangleColshapeCreateOptions): CCMPColshape {
    void options;
    throw new Error("CCMPColshapesManager.createRectangle: not supported by CCMP");
  }

  public createSphere(options: ISphereColshapeCreateOptions): CCMPColshape {
    const ccmpColshape = ccmp.colshapes.createSphere(options.position, options.range, {
      dimension: options.dimension,
    });
    return this._register(ccmpColshape);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpColshape of ccmp.colshapes.all) {
      this._register(ccmpColshape);
    }
  }

  public registerById(id: number): CCMPColshape {
    const existingColshape = this.findByID(id);
    if (existingColshape) {
      return existingColshape;
    }

    const ccmpColshape = ccmp.colshapes.getById(id);
    if (!ccmpColshape) {
      throw new Error(`CCMPColshapesManager.registerById(${id}): colshape not found.`);
    }

    return this._register(ccmpColshape);
  }

  public unregisterById(id: number): CCMPColshape {
    return this.deleteById(id);
  }

  public findByID(id: number): CCMPColshape | null {
    const colshape = this._colshapes.get(id) ?? null;
    if (colshape && !colshape.isExists) {
      this._unregister(colshape);
    } else if (colshape) {
      return colshape;
    }

    const ccmpColshape = ccmp.colshapes.getById(id);
    if (!ccmpColshape) {
      return null;
    }

    return this._register(ccmpColshape);
  }

  public getByID(id: number): CCMPColshape {
    const colshape = this.findByID(id);
    if (!colshape) {
      throw new Error(`CCMPColshapesManager.getByID(${id}): colshape not found.`);
    }
    return colshape;
  }

  public findByRemoteID(remoteId: number): CCMPColshape | null {
    const colshape = this._colshapesByRemoteId.get(remoteId) ?? null;
    if (colshape && !colshape.isExists) {
      this._unregister(colshape);
    } else if (colshape) {
      return colshape;
    }

    const ccmpColshape = ccmp.colshapes.getByRemoteId(remoteId);
    if (!ccmpColshape) {
      return null;
    }

    return this._register(ccmpColshape);
  }

  public getByRemoteID(remoteId: number): CCMPColshape {
    const colshape = this.findByRemoteID(remoteId);
    if (!colshape) {
      throw new Error(`CCMPColshapesManager.getByRemoteID(${remoteId}): colshape not found.`);
    }
    return colshape;
  }

  public deleteById(id: number): CCMPColshape {
    const colshape = this.getByID(id);
    colshape.destroy();
    return colshape;
  }

  public get iterator(): IWorldObjectsIterator<CCMPColshape> {
    return this._iterator;
  }

  private _register(ccmpColshape: CcmpColshape): CCMPColshape {
    const existingColshape = this._findRegistered(ccmpColshape);
    if (existingColshape && existingColshape.isExists) {
      return existingColshape;
    }
    if (existingColshape) {
      this._unregister(existingColshape);
    }

    const colshape = new CCMPColshape(ccmpColshape, (destroyedColshape) => {
      this._unregister(destroyedColshape);
    });
    this._colshapes.set(colshape.id, colshape);
    if (colshape.remoteId !== null) {
      this._colshapesByRemoteId.set(colshape.remoteId, colshape);
    }
    return colshape;
  }

  private _unregister(colshape: CCMPColshape): void {
    this._colshapes.delete(colshape.id);
    if (colshape.remoteId !== null) {
      this._colshapesByRemoteId.delete(colshape.remoteId);
    }
  }

  private _findRegistered(ccmpColshape: CcmpColshape): CCMPColshape | null {
    return (
      (ccmpColshape.remoteId === null ? null : (this._colshapesByRemoteId.get(ccmpColshape.remoteId) ?? null)) ??
      this._colshapes.get(ccmpColshape.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("colshapeCreated", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, colshape);
    });

    ccmp.on("colshapeDestroyed", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._findRegistered(ccmpColshape) ?? this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, colshape);
      this._unregister(colshape);
    });

    ccmp.on("colshapeStreamIn", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, colshape);
    });

    ccmp.on("colshapeStreamOut", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._findRegistered(ccmpColshape) ?? this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, colshape);
    });
  }

  private *_filter(predicate: (colshape: CCMPColshape) => boolean): IterableIterator<CCMPColshape> {
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
