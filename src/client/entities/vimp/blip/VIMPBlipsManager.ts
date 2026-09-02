import { type Blip as VimpBlip } from "@vimp-mp/types/client";
import { type VIMPEventsManager } from "@RockMod/client/net/vimp/events/VIMPEventsManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IBlipCreateOptions, type IBlipsManager } from "../../common/blip/IBlipsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { VIMPBlip } from "./VIMPBlip";

export class VIMPBlipsManager implements IBlipsManager {
  private readonly _blips = new Map<number, VIMPBlip>();

  private readonly _blipsByRemoteId = new Map<number, VIMPBlip>();

  private readonly _iterator: IWorldObjectsIterator<VIMPBlip> = {
    all: (): IterableIterator<VIMPBlip> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPBlip> => this._filter((blip) => blip.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPBlip> =>
      this._filter((blip) => {
        const position = blip.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPBlip> =>
      this._filter((blip) => blip.position.isInRange(center, range)),
  };

  public constructor(private readonly _events: VIMPEventsManager) {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IBlipCreateOptions): VIMPBlip {
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

    const vimpBlip = vimp.blips.create(options.sprite, options.position, createOptions);

    if (!vimpBlip) {
      throw new Error(`VIMPBlipsManager.create: vimp.blips.create failed for sprite "${options.sprite}"`);
    }

    return this._register(vimpBlip);
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    for (const vimpBlip of vimp.blips.all) {
      this._register(vimpBlip);
    }
  }

  public registerById(id: number): VIMPBlip {
    const existingBlip = this.findByID(id);
    if (existingBlip) {
      return existingBlip;
    }

    const vimpBlip = vimp.blips.getById(id);
    if (!vimpBlip) {
      throw new Error(`VIMPBlipsManager.registerById(${id}): blip not found.`);
    }

    return this._register(vimpBlip);
  }

  public unregisterById(id: number): VIMPBlip {
    return this.deleteById(id);
  }

  public findByID(id: number): VIMPBlip | null {
    const blip = this._blips.get(id) ?? null;
    if (blip && !blip.isExists) {
      this._unregister(blip);
    } else if (blip) {
      return blip;
    }

    const vimpBlip = vimp.blips.getById(id);
    if (!vimpBlip) {
      return null;
    }

    return this._register(vimpBlip);
  }

  public getByID(id: number): VIMPBlip {
    const blip = this.findByID(id);
    if (!blip) {
      throw new Error(`VIMPBlipsManager.getByID(${id}): blip not found.`);
    }
    return blip;
  }

  public findByRemoteID(remoteId: number): VIMPBlip | null {
    const blip = this._blipsByRemoteId.get(remoteId) ?? null;
    if (blip && !blip.isExists) {
      this._unregister(blip);
    } else if (blip) {
      return blip;
    }

    const vimpBlip = vimp.blips.getByRemoteId(remoteId);
    if (!vimpBlip) {
      return null;
    }

    return this._register(vimpBlip);
  }

  public getByRemoteID(remoteId: number): VIMPBlip {
    const blip = this.findByRemoteID(remoteId);
    if (!blip) {
      throw new Error(`VIMPBlipsManager.getByRemoteID(${remoteId}): blip not found.`);
    }
    return blip;
  }

  public deleteById(id: number): VIMPBlip {
    const blip = this.getByID(id);
    blip.destroy();
    return blip;
  }

  public get iterator(): IWorldObjectsIterator<VIMPBlip> {
    return this._iterator;
  }

  private _register(vimpBlip: VimpBlip): VIMPBlip {
    const existingBlip = this._findRegistered(vimpBlip);
    if (existingBlip && existingBlip.isExists) {
      return existingBlip;
    }
    if (existingBlip) {
      this._unregister(existingBlip);
    }

    const blip = new VIMPBlip(vimpBlip, (destroyedBlip) => {
      this._unregister(destroyedBlip);
    });
    this._blips.set(blip.id, blip);
    if (blip.remoteId !== null) {
      this._blipsByRemoteId.set(blip.remoteId, blip);
    }
    return blip;
  }

  private _unregister(blip: VIMPBlip): void {
    this._blips.delete(blip.id);
    if (blip.remoteId !== null) {
      this._blipsByRemoteId.delete(blip.remoteId);
    }
  }

  private _findRegistered(vimpBlip: VimpBlip): VIMPBlip | null {
    return (
      (vimpBlip.remoteId === null ? null : (this._blipsByRemoteId.get(vimpBlip.remoteId) ?? null)) ??
      this._blips.get(vimpBlip.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    vimp.on("blipCreated", (vimpBlip: VimpBlip | null) => {
      if (!vimpBlip) return;
      const blip = this._register(vimpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityCreated, blip);
    });

    vimp.on("blipDestroyed", (vimpBlip: VimpBlip | null) => {
      if (!vimpBlip) return;
      const blip = this._findRegistered(vimpBlip) ?? this._register(vimpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityDestroyed, blip);
      this._unregister(blip);
    });

    vimp.on("blipStreamIn", (vimpBlip: VimpBlip | null) => {
      if (!vimpBlip) return;
      const blip = this._register(vimpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityStreamIn, blip);
    });

    vimp.on("blipStreamOut", (vimpBlip: VimpBlip | null) => {
      if (!vimpBlip) return;
      const blip = this._findRegistered(vimpBlip) ?? this._register(vimpBlip);
      this._events.emitInternal(ClientInternalEventName.EntityStreamOut, blip);
    });
  }

  private *_filter(predicate: (blip: VIMPBlip) => boolean): IterableIterator<VIMPBlip> {
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
