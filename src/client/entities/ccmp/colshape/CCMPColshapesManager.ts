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
    void options;
    throw new Error(
      "CCMPColshapesManager.createCircle: client-side colshape creation is not supported by CCMP. Use server-side ccmp.colshapes.createCircle.",
    );
  }

  public createCuboid(options: ICuboidColshapeCreateOptions): CCMPColshape {
    void options;
    throw new Error(
      "CCMPColshapesManager.createCuboid: client-side colshape creation is not supported by CCMP. Use server-side ccmp.colshapes.createCube.",
    );
  }

  public createCylinder(options: ICylinderColshapeCreateOptions): CCMPColshape {
    void options;
    throw new Error(
      "CCMPColshapesManager.createCylinder: client-side colshape creation is not supported by CCMP. Use server-side ccmp.colshapes.createCylinder.",
    );
  }

  public createRectangle(options: IRectangleColshapeCreateOptions): CCMPColshape {
    void options;
    throw new Error("CCMPColshapesManager.createRectangle: not supported by CCMP");
  }

  public createSphere(options: ISphereColshapeCreateOptions): CCMPColshape {
    void options;
    throw new Error(
      "CCMPColshapesManager.createSphere: client-side colshape creation is not supported by CCMP. Use server-side ccmp.colshapes.createSphere.",
    );
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpColshape of ccmp.colshapes.all) {
      if (!this._colshapes.has(ccmpColshape.id)) {
        this._register(ccmpColshape);
      }
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
      this._colshapes.delete(id);
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
    return this.findByID(remoteId);
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
    const existingColshape = this._colshapes.get(ccmpColshape.id) ?? null;
    if (existingColshape && existingColshape.isExists) {
      return existingColshape;
    }

    const colshape = new CCMPColshape(ccmpColshape, (destroyedColshape) => {
      this._colshapes.delete(destroyedColshape.id);
    });
    this._colshapes.set(colshape.id, colshape);
    return colshape;
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("colshapeCreated", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, colshape);
    });

    ccmp.on("colshapeDestroyed", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._colshapes.get(ccmpColshape.id) ?? this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, colshape);
      this._colshapes.delete(colshape.id);
    });

    ccmp.on("colshapeStreamIn", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, colshape);
    });

    ccmp.on("colshapeStreamOut", (ccmpColshape: CcmpColshape | null) => {
      if (!ccmpColshape) return;
      const colshape = this._colshapes.get(ccmpColshape.id) ?? this._register(ccmpColshape);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, colshape);
    });
  }

  private *_filter(predicate: (colshape: CCMPColshape) => boolean): IterableIterator<CCMPColshape> {
    for (const colshape of this._colshapes.values()) {
      if (!colshape.isExists) {
        this._colshapes.delete(colshape.id);
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
        this._colshapes.delete(colshape.id);
      }
    }
  }
}
