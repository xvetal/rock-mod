/// <reference types="@classic-mp/types/client" />

import { RockMod } from "@RockMod/client/RockMod";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type Vector2D, type Vector3D } from "@shared/common/utils";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";
import { CCMPVehicle, type ICCMPNativeVehicle } from "./CCMPVehicle";

interface ICCMPVehiclesApi {
  readonly all: ICCMPNativeVehicle[];
  readonly count: number;
  getById(id: number): ICCMPNativeVehicle | null;
  getByRemoteId(remoteId: number): ICCMPNativeVehicle | null;
  getDisplayNameFromModel(model: string | number): string;
  create(
    model: string | number,
    position: { x: number; y: number; z: number },
    rotation?: { x: number; y: number; z: number },
    options?: { dimension?: number; engine?: boolean; locked?: boolean },
  ): ICCMPNativeVehicle | null;
}

interface ICCMPEventsApi {
  on(event: string, callback: (vehicle: ICCMPNativeVehicle | null) => void): void;
}

export class CCMPVehiclesManager implements IVehiclesManager {
  private readonly _vehicles = new Map<number, CCMPVehicle>();

  private readonly _vehiclesByRemoteId = new Map<number, CCMPVehicle>();

  private readonly _iterator: IWorldObjectsIterator<CCMPVehicle> = {
    all: (): IterableIterator<CCMPVehicle> => this._filter(() => true),
    dimension: (value: number): IterableIterator<CCMPVehicle> => this._filter((vehicle) => vehicle.dimension === value),
    range2D: (center: Vector2D, range: number): IterableIterator<CCMPVehicle> =>
      this._filter((vehicle) => {
        const position = vehicle.position;
        const squaredDistance = (position.x - center.x) ** 2 + (position.y - center.y) ** 2;
        return squaredDistance <= range * range;
      }),
    range3D: (center: Vector3D, range: number): IterableIterator<CCMPVehicle> =>
      this._filter((vehicle) => vehicle.position.isInRange(center, range)),
  };

  public constructor() {
    this._registerLifecycleEvents();
    this.syncWithMpPool();
  }

  public create(options: IVehicleCreateOptions): IVehicle {
    const ccmpVehicle = this._getNativeVehiclesApi()?.create(options.model, options.position, options.rotation, {
      dimension: options.dimension,
      engine: options.engine,
      locked: options.locked,
    });

    if (!ccmpVehicle) {
      throw new Error(`CCMPVehiclesManager.create: ccmp.vehicles.create failed for model "${options.model}"`);
    }

    return this._register(ccmpVehicle);
  }

  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return this._getNativeVehiclesApi()?.getDisplayNameFromModel(modelHash) ?? "";
  }

  public syncWithMpPool(): void {
    this._pruneDestroyed();

    const ccmpVehicles = this._getNativeVehiclesApi();
    if (!ccmpVehicles) return;

    for (const ccmpVehicle of ccmpVehicles.all) {
      this._register(ccmpVehicle);
    }
  }

  public registerById(id: number): IVehicle {
    const existingVehicle = this.findByID(id);
    if (existingVehicle) return existingVehicle;

    const ccmpVehicle = this._getNativeVehiclesApi()?.getById(id) ?? null;
    if (!ccmpVehicle) {
      throw new Error(`CCMPVehiclesManager.registerById(${id}): vehicle not found.`);
    }

    return this._register(ccmpVehicle);
  }

  public unregisterById(id: number): IVehicle {
    return this.deleteById(id);
  }

  public findByID(id: number): IVehicle | null {
    const vehicle = this._vehicles.get(id) ?? null;
    if (vehicle && vehicle.isExists) return vehicle;
    if (vehicle) this._unregister(vehicle);

    const ccmpVehicle = this._getNativeVehiclesApi()?.getById(id) ?? null;
    if (!ccmpVehicle) return null;

    return this._register(ccmpVehicle);
  }

  public getByID(id: number): IVehicle {
    const vehicle = this.findByID(id);
    if (!vehicle) {
      throw new Error(`CCMPVehiclesManager.getByID(${id}): vehicle not found.`);
    }
    return vehicle;
  }

  public findByRemoteID(remoteId: number): IVehicle | null {
    const vehicle = this._vehiclesByRemoteId.get(remoteId) ?? null;
    if (vehicle && vehicle.isExists) return vehicle;
    if (vehicle) this._unregister(vehicle);

    const ccmpVehicle = this._getNativeVehiclesApi()?.getByRemoteId(remoteId) ?? null;
    if (!ccmpVehicle) return null;

    return this._register(ccmpVehicle);
  }

  public getByRemoteID(remoteId: number): IVehicle {
    const vehicle = this.findByRemoteID(remoteId);
    if (!vehicle) {
      throw new Error(`CCMPVehiclesManager.getByRemoteID(${remoteId}): vehicle not found.`);
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

  private _register(ccmpVehicle: ICCMPNativeVehicle): CCMPVehicle {
    const existingVehicle = this._findRegistered(ccmpVehicle);
    if (existingVehicle && existingVehicle.isExists) return existingVehicle;
    if (existingVehicle) this._unregister(existingVehicle);

    const vehicle = new CCMPVehicle(ccmpVehicle, (destroyedVehicle) => {
      this._unregister(destroyedVehicle);
    });
    this._vehicles.set(vehicle.id, vehicle);
    if (vehicle.remoteId !== null) {
      this._vehiclesByRemoteId.set(vehicle.remoteId, vehicle);
    }
    return vehicle;
  }

  private _unregister(vehicle: CCMPVehicle): void {
    this._vehicles.delete(vehicle.id);
    if (vehicle.remoteId !== null) {
      this._vehiclesByRemoteId.delete(vehicle.remoteId);
    }
  }

  private _findRegistered(ccmpVehicle: ICCMPNativeVehicle): CCMPVehicle | null {
    return (
      (ccmpVehicle.remoteId === null ? null : (this._vehiclesByRemoteId.get(ccmpVehicle.remoteId) ?? null)) ??
      this._vehicles.get(ccmpVehicle.id) ??
      null
    );
  }

  private _registerLifecycleEvents(): void {
    const eventsApi = ccmp as unknown as ICCMPEventsApi;

    eventsApi.on("vehicleCreated", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityCreated, vehicle);
    });

    eventsApi.on("vehicleDestroyed", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._findRegistered(ccmpVehicle) ?? this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityDestroyed, vehicle);
      this._unregister(vehicle);
    });

    eventsApi.on("vehicleStreamIn", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamIn, vehicle);
    });

    eventsApi.on("vehicleStreamOut", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._findRegistered(ccmpVehicle) ?? this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamOut, vehicle);
    });
  }

  private *_filter(predicate: (vehicle: CCMPVehicle) => boolean): IterableIterator<CCMPVehicle> {
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

  private _getNativeVehiclesApi(): ICCMPVehiclesApi | null {
    return (ccmp as unknown as { vehicles?: ICCMPVehiclesApi }).vehicles ?? null;
  }
}
