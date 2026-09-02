/// <reference types="@vimp-mp/types/client" />

import { RockMod } from "@RockMod/client/RockMod";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { VIMPVehicle, type IVIMPNativeVehicle } from "./VIMPVehicle";

interface IVIMPVehiclesApi {
  readonly all: IVIMPNativeVehicle[];
  readonly count: number;
  getById(id: number): IVIMPNativeVehicle | null;
  getByRemoteId(remoteId: number): IVIMPNativeVehicle | null;
  getDisplayNameFromModel(model: string | number): string;
  create(
    model: string | number,
    position: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number },
    options?: {
      dimension?: number;
      engine?: boolean;
      locked?: boolean;
      numberPlate?: string;
      numberPlateType?: number;
    },
  ): IVIMPNativeVehicle | null;
}

interface IVIMPEventsApi {
  on(event: string, callback: (vehicle: IVIMPNativeVehicle | null) => void): void;
}

export class VIMPVehiclesManager implements IVehiclesManager {
  private readonly _vehicles = new Map<number, VIMPVehicle>();

  private readonly _vehiclesByRemoteId = new Map<number, VIMPVehicle>();

  private readonly _iterator: IWorldObjectsIterator<VIMPVehicle> = {
    all: (): IterableIterator<VIMPVehicle> => this._filter(() => true),
    dimension: (value: number): IterableIterator<VIMPVehicle> => this._filter((vehicle) => vehicle.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<VIMPVehicle> =>
      this._filter((vehicle) => {
        const position = vehicle.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<VIMPVehicle> =>
      this._filter((vehicle) => vehicle.position.isInRange(center, range)),
  };

  public constructor() {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IVehicleCreateOptions): IVehicle {
    const createOptions: NonNullable<Parameters<IVIMPVehiclesApi["create"]>[3]> = {
      dimension: options.dimension,
      engine: options.engine,
      locked: options.locked,
    };

    if (options.numberPlate !== undefined) createOptions.numberPlate = options.numberPlate;
    if (options.numberPlateType !== undefined) createOptions.numberPlateType = options.numberPlateType;

    const vimpVehicle = this._getNativeVehiclesApi()?.create(
      options.model,
      options.position,
      options.rotation,
      createOptions,
    );

    if (!vimpVehicle) {
      throw new Error(`VIMPVehiclesManager.create: vimp.vehicles.create failed for model "${options.model}"`);
    }

    return this._register(vimpVehicle);
  }

  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return this._getNativeVehiclesApi()?.getDisplayNameFromModel(modelHash) ?? "";
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    const vimpVehicles = this._getNativeVehiclesApi();
    if (!vimpVehicles) return;

    for (const vimpVehicle of vimpVehicles.all) {
      this._register(vimpVehicle);
    }
  }

  public registerById(id: number): IVehicle {
    const existingVehicle = this.findByID(id);
    if (existingVehicle) return existingVehicle;

    const vimpVehicle = this._getNativeVehiclesApi()?.getById(id) ?? null;
    if (!vimpVehicle) {
      throw new Error(`VIMPVehiclesManager.registerById(${id}): vehicle not found.`);
    }

    return this._register(vimpVehicle);
  }

  public unregisterById(id: number): IVehicle {
    return this.deleteById(id);
  }

  public findByID(id: number): IVehicle | null {
    const vehicle = this._vehicles.get(id) ?? null;
    if (vehicle && vehicle.isExists) return vehicle;
    if (vehicle) this._unregister(vehicle);

    const vimpVehicle = this._getNativeVehiclesApi()?.getById(id) ?? null;
    if (!vimpVehicle) return null;

    return this._register(vimpVehicle);
  }

  public getByID(id: number): IVehicle {
    const vehicle = this.findByID(id);
    if (!vehicle) {
      throw new Error(`VIMPVehiclesManager.getByID(${id}): vehicle not found.`);
    }
    return vehicle;
  }

  public findByRemoteID(remoteId: number): IVehicle | null {
    const vehicle = this._vehiclesByRemoteId.get(remoteId) ?? null;
    if (vehicle && vehicle.isExists) return vehicle;
    if (vehicle) this._unregister(vehicle);

    const vimpVehicle = this._getNativeVehiclesApi()?.getByRemoteId(remoteId) ?? null;
    if (!vimpVehicle) return null;

    return this._register(vimpVehicle);
  }

  public getByRemoteID(remoteId: number): IVehicle {
    const vehicle = this.findByRemoteID(remoteId);
    if (!vehicle) {
      throw new Error(`VIMPVehiclesManager.getByRemoteID(${remoteId}): vehicle not found.`);
    }
    return vehicle;
  }

  public deleteById(id: number): IVehicle {
    const vehicle = this.getByID(id);
    vehicle.destroy();
    return vehicle;
  }

  public get iterator(): IWorldObjectsIterator<IVehicle> {
    return this._iterator;
  }

  private _register(vimpVehicle: IVIMPNativeVehicle): VIMPVehicle {
    const existingVehicle = this._findRegistered(vimpVehicle);
    if (existingVehicle && existingVehicle.isExists) return existingVehicle;
    if (existingVehicle) this._unregister(existingVehicle);

    const vehicle = new VIMPVehicle(vimpVehicle, (destroyedVehicle) => {
      this._unregister(destroyedVehicle);
    });
    this._vehicles.set(vehicle.id, vehicle);
    if (vehicle.remoteId !== null) {
      this._vehiclesByRemoteId.set(vehicle.remoteId, vehicle);
    }
    return vehicle;
  }

  private _unregister(vehicle: VIMPVehicle): void {
    this._vehicles.delete(vehicle.id);
    if (vehicle.remoteId !== null) {
      this._vehiclesByRemoteId.delete(vehicle.remoteId);
    }
  }

  private _findRegistered(vimpVehicle: IVIMPNativeVehicle): VIMPVehicle | null {
    return (
      (vimpVehicle.remoteId === null ? null : (this._vehiclesByRemoteId.get(vimpVehicle.remoteId) ?? null)) ??
      this._vehicles.get(vimpVehicle.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    const eventsApi = vimp as unknown as IVIMPEventsApi;

    eventsApi.on("vehicleCreated", (vimpVehicle) => {
      if (!vimpVehicle) return;
      const vehicle = this._register(vimpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityCreated, vehicle);
    });

    eventsApi.on("vehicleDestroyed", (vimpVehicle) => {
      if (!vimpVehicle) return;
      const vehicle = this._findRegistered(vimpVehicle) ?? this._register(vimpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityDestroyed, vehicle);
      this._unregister(vehicle);
    });

    eventsApi.on("vehicleStreamIn", (vimpVehicle) => {
      if (!vimpVehicle) return;
      const vehicle = this._register(vimpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamIn, vehicle);
    });

    eventsApi.on("vehicleStreamOut", (vimpVehicle) => {
      if (!vimpVehicle) return;
      const vehicle = this._findRegistered(vimpVehicle) ?? this._register(vimpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamOut, vehicle);
    });
  }

  private *_filter(predicate: (vehicle: VIMPVehicle) => boolean): IterableIterator<VIMPVehicle> {
    for (const vehicle of this._vehicles.values()) {
      if (!vehicle.isExists) {
        this._unregister(vehicle);
        continue;
      }

      if (predicate(vehicle)) {
        yield vehicle;
      }
    }
  }

  private _pruneDestroyed(): void {
    for (const vehicle of this._vehicles.values()) {
      if (!vehicle.isExists) {
        this._unregister(vehicle);
      }
    }
  }

  private _getNativeVehiclesApi(): IVIMPVehiclesApi | null {
    return (vimp as unknown as { vehicles?: IVIMPVehiclesApi }).vehicles ?? null;
  }
}
