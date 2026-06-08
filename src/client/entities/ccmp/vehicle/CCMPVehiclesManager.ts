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
}

interface ICCMPEventsApi {
  on(event: string, callback: (vehicle: ICCMPNativeVehicle | null) => void): void;
}

export class CCMPVehiclesManager implements IVehiclesManager {
  private readonly _vehicles = new Map<number, CCMPVehicle>();

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
    void options;
    throw new Error(
      "CCMPVehiclesManager.create: client-side vehicle creation is not supported by CCMP. Use server-side ccmp.vehicles.create.",
    );
  }

  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return ccmp.natives.vehicle.getDisplayNameFromVehicleModel(modelHash);
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
    if (vehicle) this._vehicles.delete(id);

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
    return this.findByID(remoteId);
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
    const existingVehicle = this._vehicles.get(ccmpVehicle.id) ?? null;
    if (existingVehicle) return existingVehicle;

    const vehicle = new CCMPVehicle(ccmpVehicle, (destroyedVehicle) => {
      this._vehicles.delete(destroyedVehicle.id);
    });
    this._vehicles.set(vehicle.id, vehicle);
    return vehicle;
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
      const vehicle = this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityDestroyed, vehicle);
      this._vehicles.delete(vehicle.id);
    });

    eventsApi.on("vehicleStreamIn", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamIn, vehicle);
    });

    eventsApi.on("vehicleStreamOut", (ccmpVehicle) => {
      if (!ccmpVehicle) return;
      const vehicle = this._vehicles.get(ccmpVehicle.id) ?? this._register(ccmpVehicle);
      RockMod.instance.net.events.emitInternal(ClientInternalEventName.EntityStreamOut, vehicle);
    });
  }

  private *_filter(predicate: (vehicle: CCMPVehicle) => boolean): IterableIterator<CCMPVehicle> {
    for (const vehicle of this._vehicles.values()) {
      if (!vehicle.isExists) {
        this._vehicles.delete(vehicle.id);
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
        this._vehicles.delete(vehicle.id);
      }
    }
  }

  private _getNativeVehiclesApi(): ICCMPVehiclesApi | null {
    return (ccmp as unknown as { vehicles?: ICCMPVehiclesApi }).vehicles ?? null;
  }
}
