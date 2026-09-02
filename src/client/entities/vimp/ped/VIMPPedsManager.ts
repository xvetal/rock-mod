import { type Ped as VimpPed } from "@vimp-mp/types/client";
import { type VIMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { VIMPPed } from "./VIMPPed";

export class VIMPPedsManager implements IPedsManager {
  private readonly _peds = new Map<number, VIMPPed>();

  private readonly _pedsByRemoteId = new Map<number, VIMPPed>();

  private readonly _iterator: IWorldObjectsIterator<VIMPPed> = {
    all: (): IterableIterator<VIMPPed> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPPed> => this._filter((ped) => ped.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPPed> =>
      this._filter((ped) => {
        const position = ped.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPPed> =>
      this._filter((ped) => ped.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: VIMPEventsManager) {
    this._registerStreamEvents();
    this.syncWithMpPool();
  }

  public create(options: IPedCreateOptions): VIMPPed {
    const { model, position, rotation, dimension } = options;
    const vimpPed = vimp.peds.create(model, position, rotation.z, { dimension });

    if (!vimpPed) {
      throw new Error(`VIMPPedsManager.create: vimp.peds.create failed for model "${model}"`);
    }

    return this._register(vimpPed);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const vimpPed of vimp.peds.all) {
      this._register(vimpPed);
    }
  }

  public registerById(id: number): VIMPPed {
    const existingPed = this.findByID(id);
    if (existingPed) {
      return existingPed;
    }

    const vimpPed = vimp.peds.getById(id);
    if (!vimpPed) {
      throw new Error(`VIMPPedsManager.registerById(${id}): ped not found.`);
    }

    return this._register(vimpPed);
  }

  public unregisterById(id: number): VIMPPed {
    return this.deleteById(id);
  }

  public findByID(id: number): VIMPPed | null {
    const ped = this._peds.get(id) ?? null;
    if (ped && !ped.isExists) {
      this._unregister(ped);
    } else if (ped) {
      return ped;
    }

    const vimpPed = vimp.peds.getById(id);
    if (!vimpPed) {
      return null;
    }

    return this._register(vimpPed);
  }

  public getByID(id: number): VIMPPed {
    const ped = this.findByID(id);
    if (!ped) {
      throw new Error(`VIMPPedsManager.getByID(${id}): ped not found.`);
    }
    return ped;
  }

  public findByRemoteID(remoteId: number): VIMPPed | null {
    const ped = this._pedsByRemoteId.get(remoteId) ?? null;
    if (ped && !ped.isExists) {
      this._unregister(ped);
    } else if (ped) {
      return ped;
    }

    const vimpPed = vimp.peds.getByRemoteId(remoteId);
    if (!vimpPed) {
      return null;
    }

    return this._register(vimpPed);
  }

  public getByRemoteID(remoteId: number): VIMPPed {
    const ped = this.findByRemoteID(remoteId);
    if (!ped) {
      throw new Error(`VIMPPedsManager.getByRemoteID(${remoteId}): ped not found.`);
    }
    return ped;
  }

  public deleteById(id: number): VIMPPed {
    const ped = this.getByID(id);
    ped.destroy();
    return ped;
  }

  public get iterator(): IWorldObjectsIterator<VIMPPed> {
    return this._iterator;
  }

  private *_filter(predicate: (ped: VIMPPed) => boolean): IterableIterator<VIMPPed> {
    for (const ped of this._peds.values()) {
      if (!ped.isExists) {
        this._unregister(ped);
        continue;
      }

      if (predicate(ped)) {
        yield ped;
      }
    }
  }

  private _register(vimpPed: VimpPed): VIMPPed {
    const existingPed = this._findRegistered(vimpPed);
    if (existingPed && existingPed.isExists) {
      return existingPed;
    }
    if (existingPed) {
      this._unregister(existingPed);
    }

    const ped = new VIMPPed(vimpPed, (destroyedPed) => {
      this._unregister(destroyedPed);
    });
    this._peds.set(ped.id, ped);
    if (ped.remoteId !== null) {
      this._pedsByRemoteId.set(ped.remoteId, ped);
    }
    return ped;
  }

  private _unregister(ped: VIMPPed): void {
    this._peds.delete(ped.id);
    if (ped.remoteId !== null) {
      this._pedsByRemoteId.delete(ped.remoteId);
    }
  }

  private _findRegistered(vimpPed: VimpPed): VIMPPed | null {
    return (
      (vimpPed.remoteId === null ? null : (this._pedsByRemoteId.get(vimpPed.remoteId) ?? null)) ??
      this._peds.get(vimpPed.id) ??
      null
    );
  }

  private _registerStreamEvents(): void {
    vimp.on("pedCreated", (vimpPed: VimpPed | null) => {
      if (vimpPed) {
        const ped = this._register(vimpPed);
        this._events.emitInternal(ClientInternalEventName.EntityCreated, ped);
      }
    });

    vimp.on("pedDestroyed", (vimpPed: VimpPed | null) => {
      if (vimpPed) {
        const ped = this._findRegistered(vimpPed) ?? this._register(vimpPed);
        this._events.emitInternal(ClientInternalEventName.EntityDestroyed, ped);
        this._unregister(ped);
      }
    });

    vimp.on("pedStreamIn", (vimpPed: VimpPed | null) => {
      if (vimpPed) {
        const ped = this._register(vimpPed);
        this._events.emitInternal(ClientInternalEventName.EntityStreamIn, ped);
      }
    });

    vimp.on("pedStreamOut", (vimpPed: VimpPed | null) => {
      if (vimpPed) {
        const ped = this._findRegistered(vimpPed) ?? this._register(vimpPed);
        if (ped) {
          this._events.emitInternal(ClientInternalEventName.EntityStreamOut, ped);
        }
      }
    });
  }

  private _pruneDestroyed(): void {
    for (const ped of this._peds.values()) {
      if (!ped.isExists) {
        this._unregister(ped);
      }
    }
  }
}
