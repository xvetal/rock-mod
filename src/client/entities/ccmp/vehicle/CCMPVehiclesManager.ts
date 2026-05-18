/// <reference types="@classic-mp/types/client" />

import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVehicleCreateOptions, type IVehiclesManager } from "../../common/vehicle/IVehiclesManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";

const EMPTY_VEHICLES: readonly IVehicle[] = [];

/**
 * Реализация `IVehiclesManager` под CCMP — **пустой пул** + native helper.
 *
 * ### Почему пусто
 *
 * RageMP даёт `mp.vehicles.toArray()`/`mp.vehicles.at(id)` — JS-side pool из
 * stream'нутых-в-радиус транспортных средств, заполняемый рантаймом. CCMP
 * такого пула на client-side не экспонирует:
 *  - `ccmp.natives.vehicle.createVehicle` создаёт локальный handle без id /
 *    replication / managed lifecycle.
 *  - `ccmp.vehicles.*` (server-side) спавнит реплицируемые vehicle-сущности,
 *    но клиент видит их данные через game state, а не как managed-IVehicle-
 *    инстансы в JS-pool'е.
 *
 * Поэтому iterator всегда пустой, `find*` возвращает null, `get*` и `deleteById` кидают.
 *
 * ### Hot path: `iterator.all()` на каждый render-tick
 *
 * Геймод-консьюмер `VehiclePartsInteractionController.syncVehicleProximity` →
 * `VehiclePartsInteractionService.syncState` → `VehicleService.getNearbyVehicles`
 * → `VehicleRepository.getNearby` → `VehicleRepository.getAll` → `iterator.all()`.
 * До этой реализации `VehiclesManager` был `createNotImplementedProxy`, и каждый
 * frame падал `CCMPVehiclesManager.iterator.all: not implemented yet`. Теперь
 * iterator возвращает пустой итератор — interaction-сервис тихо деградирует
 * (нет vehicles в радиусе → нет UI-хинтов / интеракций).
 *
 * ### `create(...)` под CCMP
 *
 * Не реализован осознанно: `VehicleRepository.create(...)` в геймоде ожидает
 * `IRockModVehicle` с id/remoteId/position/etc, а CCMP-натив `createVehicle`
 * возвращает только handle без id-mapping'а. Для корректной поддержки нужен
 * полноценный `CCMPVehicle`-класс и интеграция с server-side `ccmp.vehicles.*`
 * — отдельная задача. Сейчас бросаем понятную ошибку.
 *
 * ### `getDisplayNameFromVehicleModel`
 *
 * Этот метод **реализован** — натив `getDisplayNameFromVehicleModel`
 * (`0xB215AAC32D25D019`) экспонирован в `ccmp.natives.vehicle.*` и работает
 * без vehicle-pool'а (принимает только modelHash, возвращает GXT-ключ или
 * "CARNOTFOUND" для unknown-моделей).
 *
 * TODO: когда понадобится spawning vehicles из клиента (миссии, тестовые
 * объекты) — реализовать через `ccmp.natives.vehicle.createVehicle` + локальный
 * id-counter + `CCMPVehicle`-обёртку. Для синхронизированных vehicles нужна
 * server-side фабрика с `ccmp.vehicles.create` и net-events для распространения
 * id-mapping'а.
 */
export class CCMPVehiclesManager implements IVehiclesManager {
  // -- IVehiclesManager -----------------------------------------------------

  public create(options: IVehicleCreateOptions): IVehicle {
    void options;
    throw new Error(
      "CCMPVehiclesManager.create: создание vehicles на client-side под CCMP не поддерживается. " +
        "Используйте server-side `ccmp.vehicles.create` (см. server/entities/ccmp/vehicle/*), " +
        "либо вызывайте `ccmp.natives.vehicle.createVehicle` напрямую для локального vehicle-handle.",
    );
  }

  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return ccmp.natives.vehicle.getDisplayNameFromVehicleModel(modelHash);
  }

  // -- IEntitiesManager -----------------------------------------------------

  public syncWithMpPool(): void {
    // No-op: client-side vehicle pool под CCMP отсутствует, синхронизировать нечего.
  }

  public registerById(id: number): IVehicle {
    throw new Error(
      `CCMPVehiclesManager.registerById(${id}): client-side vehicle pool под CCMP отсутствует, ` +
        "регистрировать vehicle по id невозможно.",
    );
  }

  public unregisterById(id: number): IVehicle {
    throw new Error(
      `CCMPVehiclesManager.unregisterById(${id}): client-side vehicle pool под CCMP отсутствует, ` +
        "разрегистрировать vehicle по id невозможно.",
    );
  }

  // -- IBaseObjectsManager / IWorldObjectsManager ---------------------------

  public findByID(id: number): IVehicle | null {
    void id;
    return null;
  }

  public getByID(id: number): IVehicle {
    throw new Error(`CCMPVehiclesManager.getByID(${id}): vehicle не найден (пул пуст под CCMP).`);
  }

  public findByRemoteID(remoteId: number): IVehicle | null {
    void remoteId;
    return null;
  }

  public getByRemoteID(remoteId: number): IVehicle {
    throw new Error(`CCMPVehiclesManager.getByRemoteID(${remoteId}): vehicle не найден (пул пуст под CCMP).`);
  }

  public deleteById(id: number): IVehicle {
    throw new Error(`CCMPVehiclesManager.deleteById(${id}): vehicle не найден (пул пуст под CCMP).`);
  }

  public get iterator(): IWorldObjectsIterator<IVehicle> {
    return this._iterator;
  }

  // Iterator реализован inline и возвращает пустые итераторы — hot path
  // `VehiclePartsInteractionController.syncVehicleProximity` → `VehicleRepository.getNearby`
  // теперь тихо деградирует вместо падения на каждом render-tick'е.
  private readonly _iterator: IWorldObjectsIterator<IVehicle> = {
    all: (): IterableIterator<IVehicle> => EMPTY_VEHICLES[Symbol.iterator](),
    dimension: (): IterableIterator<IVehicle> => EMPTY_VEHICLES[Symbol.iterator](),
    range2D: (): IterableIterator<IVehicle> => EMPTY_VEHICLES[Symbol.iterator](),
    range3D: (): IterableIterator<IVehicle> => EMPTY_VEHICLES[Symbol.iterator](),
  };
}
