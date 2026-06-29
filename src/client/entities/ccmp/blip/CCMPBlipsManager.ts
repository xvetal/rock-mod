import { type Blip as CcmpBlip } from "@classic-mp/types/client";
import { type CCMPEventsManager } from "@RockMod/client/net/ccmp/events/CCMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPBlip } from "./CCMPBlip";

export class CCMPBlipsManager implements IBlipsManager {
  private readonly _blips = new Map<number, CCMPBlip>();

  private readonly _blipsByRemoteId = new Map<number, CCMPBlip>();

  private readonly _iterator: IWorldObjectsIterator<CCMPBlip> = {
    all: (): IterableIterator<CCMPBlip> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPBlip> => this._filter((blip) => blip.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPBlip> =>
      this._filter((blip) => {
        const position = blip.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPBlip> =>
      this._filter((blip) => blip.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: CCMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IBlipCreateOptions): CCMPBlip {
    const createOptions: {
      dimension?: number;
      alpha?: number;
      color?: number;
      drawDistance?: number;
      global?: boolean;
      name?: string;
      rotation?: number;
      scale?: number;
      shortRange?: boolean;
    } = {
      dimension: options.dimension,
    };

    if (options.alpha !== undefined) createOptions.alpha = options.alpha;
    if (options.color !== undefined) createOptions.color = options.color;
    if (options.drawDistance !== undefined) createOptions.drawDistance = options.drawDistance;
    if (options.global !== undefined) createOptions.global = options.global;
    if (options.name !== undefined) createOptions.name = options.name;
    if (options.rotation !== undefined) createOptions.rotation = options.rotation;
    if (options.scale !== undefined) createOptions.scale = options.scale;
    if (options.shortRange !== undefined) createOptions.shortRange = options.shortRange;

    const ccmpBlip = ccmp.blips.create(options.sprite, options.position, createOptions);

    if (!ccmpBlip) {
      throw new Error(`CCMPBlipsManager.create: ccmp.blips.create failed for sprite "${options.sprite}"`);
    }

    return this._register(ccmpBlip);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const ccmpBlip of ccmp.blips.all) {
      this._register(ccmpBlip);
    }
  }

  public registerById(id: number): CCMPBlip {
    const existingBlip = this.findByID(id);
    if (existingBlip) {
      return existingBlip;
    }

    const ccmpBlip = ccmp.blips.getById(id);
    if (!ccmpBlip) {
      throw new Error(`CCMPBlipsManager.registerById(${id}): blip not found.`);
    }

    return this._register(ccmpBlip);
  }

  public unregisterById(id: number): CCMPBlip {
    return this.deleteById(id);
  }

  public findByID(id: number): CCMPBlip | null {
    const blip = this._blips.get(id) ?? null;
    if (blip && !blip.isExists) {
      this._unregister(blip);
    } else if (blip) {
      return blip;
    }

    const ccmpBlip = ccmp.blips.getById(id);
    if (!ccmpBlip) {
      return null;
    }

    return this._register(ccmpBlip);
  }

  public getByID(id: number): CCMPBlip {
    const blip = this.findByID(id);
    if (!blip) {
      throw new Error(`CCMPBlipsManager.getByID(${id}): blip not found.`);
    }
    return blip;
  }

  public findByRemoteID(remoteId: number): CCMPBlip | null {
    const blip = this._blipsByRemoteId.get(remoteId) ?? null;
    if (blip && !blip.isExists) {
      this._unregister(blip);
    } else if (blip) {
      return blip;
    }

    const ccmpBlip = ccmp.blips.getByRemoteId(remoteId);
    if (!ccmpBlip) {
      return null;
    }

    return this._register(ccmpBlip);
  }

  public getByRemoteID(remoteId: number): CCMPBlip {
    const blip = this.findByRemoteID(remoteId);
    if (!blip) {
      throw new Error(`CCMPBlipsManager.getByRemoteID(${remoteId}): blip not found.`);
    }
    return blip;
  }

  public deleteById(id: number): CCMPBlip {
    const blip = this.getByID(id);
    blip.destroy();
    return blip;
  }

  public get iterator(): IWorldObjectsIterator<CCMPBlip> {
    return this._iterator;
  }

  private _register(ccmpBlip: CcmpBlip): CCMPBlip {
    const existingBlip = this._findRegistered(ccmpBlip);
    if (existingBlip && existingBlip.isExists) {
      return existingBlip;
    }
    if (existingBlip) {
      this._unregister(existingBlip);
    }

    const blip = new CCMPBlip(ccmpBlip, (destroyedBlip) => {
      this._unregister(destroyedBlip);
    });
    this._blips.set(blip.id, blip);
    if (blip.remoteId !== null) {
      this._blipsByRemoteId.set(blip.remoteId, blip);
    }
    return blip;
  }

  private _unregister(blip: CCMPBlip): void {
    this._blips.delete(blip.id);
    if (blip.remoteId !== null) {
      this._blipsByRemoteId.delete(blip.remoteId);
    }
  }

  private _findRegistered(ccmpBlip: CcmpBlip): CCMPBlip | null {
    return (
      (ccmpBlip.remoteId === null ? null : (this._blipsByRemoteId.get(ccmpBlip.remoteId) ?? null)) ??
      this._blips.get(ccmpBlip.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    ccmp.on("blipCreated", (ccmpBlip: CcmpBlip | null) => {
      if (!ccmpBlip) return;
      const blip = this._register(ccmpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, blip);
    });

    ccmp.on("blipDestroyed", (ccmpBlip: CcmpBlip | null) => {
      if (!ccmpBlip) return;
      const blip = this._findRegistered(ccmpBlip) ?? this._register(ccmpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, blip);
      this._unregister(blip);
    });

    ccmp.on("blipStreamIn", (ccmpBlip: CcmpBlip | null) => {
      if (!ccmpBlip) return;
      const blip = this._register(ccmpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, blip);
    });

    ccmp.on("blipStreamOut", (ccmpBlip: CcmpBlip | null) => {
      if (!ccmpBlip) return;
      const blip = this._findRegistered(ccmpBlip) ?? this._register(ccmpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, blip);
    });
  }

  private *_filter(predicate: (blip: CCMPBlip) => boolean): IterableIterator<CCMPBlip> {
    for (const blip of this._blips.values()) {
      if (!blip.isExists) {
        this._unregister(blip);
        continue;
      }

      if (predicate(blip)) {
        yield blip;
      }
    }
  }

  private _pruneDestroyed(): void {
    for (const blip of this._blips.values()) {
      if (!blip.isExists) {
        this._unregister(blip);
      }
    }
  }
}
