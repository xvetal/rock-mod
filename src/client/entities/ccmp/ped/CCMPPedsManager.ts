import { type Ped as CcmpPed } from "@classic-mp/types/client";
import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { CCMPPed } from "./CCMPPed";

export class CCMPPedsManager implements IPedsManager {
  private readonly _peds = new Map<number, CCMPPed>();

  private readonly _iterator: IWorldObjectsIterator<CCMPPed> = {
    all: (): IterableIterator<CCMPPed> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPPed> => this._filter((ped) => ped.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPPed> =>
      this._filter((ped) => {
        const position = ped.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPPed> =>
      this._filter((ped) => ped.position.isInRange(center, range)),
  };

  public create(options: IPedCreateOptions): CCMPPed {
    const { model, position, rotation, dimension } = options;
    const ccmpPed = ccmp.peds.create(model, position, rotation.z, { dimension });

    if (!ccmpPed) {
      throw new Error(`CCMPPedsManager.create: ccmp.peds.create failed for model "${model}"`);
    }

    return this._register(ccmpPed);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpPed of ccmp.peds.all) {
      if (!this._peds.has(ccmpPed.id)) {
        this._register(ccmpPed);
      }
    }
  }

  public registerById(id: number): CCMPPed {
    const existingPed = this.findByID(id);
    if (existingPed) {
      return existingPed;
    }

    const ccmpPed = ccmp.peds.getById(id);
    if (!ccmpPed) {
      throw new Error(`CCMPPedsManager.registerById(${id}): ped not found.`);
    }

    return this._register(ccmpPed);
  }

  public unregisterById(id: number): CCMPPed {
    return this.deleteById(id);
  }

  public findByID(id: number): CCMPPed | null {
    const ped = this._peds.get(id) ?? null;
    if (ped && !ped.isExists) {
      this._peds.delete(id);
      return null;
    }
    return ped;
  }

  public getByID(id: number): CCMPPed {
    const ped = this.findByID(id);
    if (!ped) {
      throw new Error(`CCMPPedsManager.getByID(${id}): ped not found.`);
    }
    return ped;
  }

  public findByRemoteID(remoteId: number): CCMPPed | null {
    return remoteId === 0 ? null : this.findByID(remoteId);
  }

  public getByRemoteID(remoteId: number): CCMPPed {
    const ped = this.findByRemoteID(remoteId);
    if (!ped) {
      throw new Error(`CCMPPedsManager.getByRemoteID(${remoteId}): ped not found.`);
    }
    return ped;
  }

  public deleteById(id: number): CCMPPed {
    const ped = this.getByID(id);
    ped.destroy();
    return ped;
  }

  public get iterator(): IWorldObjectsIterator<CCMPPed> {
    return this._iterator;
  }

  private *_filter(predicate: (ped: CCMPPed) => boolean): IterableIterator<CCMPPed> {
    for (const ped of this._peds.values()) {
      if (!ped.isExists) {
        this._peds.delete(ped.id);
        continue;
      }

      if (predicate(ped)) {
        yield ped;
      }
    }
  }

  private _register(ccmpPed: CcmpPed): CCMPPed {
    const ped = new CCMPPed(ccmpPed, (destroyedPed) => {
      this._peds.delete(destroyedPed.id);
    });
    this._peds.set(ped.id, ped);
    return ped;
  }

  private _pruneDestroyed(): void {
    for (const ped of this._peds.values()) {
      if (!ped.isExists) {
        this._peds.delete(ped.id);
      }
    }
  }
}
