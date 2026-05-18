import { type IPed } from "../../common/ped/IPed";
import { type IPedCreateOptions, type IPedsManager } from "../../common/ped/IPedsManager";
import { type IWorldObjectsIterator } from "../../common/worldObject/IWorldObjectsIterator";

const EMPTY_PEDS: readonly IPed[] = [];

/**
 * Реализация `IPedsManager` под CCMP — **пустой пул**.
 *
 * ### Почему пусто
 *
 * RageMP даёт `mp.peds.toArray()`/`mp.peds.at(id)` — JS-side pool из
 * stream'нутых-в-радиус ped'ов, заполняемый рантаймом. CCMP такого пула
 * на client-side не экспонирует: есть только native `ccmp.natives.ped.createPed`
 * (создаёт локальный handle без id/replication) и server-side `ccmp.peds.*`
 * (server-spawned NPC, реплицируются на клиентов, но клиент видит их не как
 * managed-IPed-инстансы, а как часть `Ped`-данных, которые рантайм рисует сам).
 *
 * Поэтому iterator всегда пустой, find* возвращает null, get* кидает.
 *
 * ### Hot path: `iterator.all()` на каждый render-tick
 *
 * Геймод-консьюмер `PedNametagController.render` → `PedNametagService.update`
 * → `PedRepository.getAllInRadius` → `PedRepository.getAll` → `iterator.all()`.
 * До этой реализации `PedsManager` был `createNotImplementedProxy`, и каждый
 * frame падал `CCMPPedsManager.iterator.all: not implemented yet`. Теперь
 * iterator возвращает пустой итератор — nametag-сервис тихо деградирует
 * (нет ped'ов в радиусе → нет nametag'ов).
 *
 * ### `create(...)` под CCMP
 *
 * Не реализован осознанно: `PedRepository.create(...)` в геймоде ожидает
 * `IRockModPed` с id/remoteId/position/etc, а CCMP-натив `createPed` возвращает
 * только handle без id-mapping'а. Для корректной поддержки нужен полноценный
 * `CCMPPed`-класс и интеграция с server-side `ccmp.peds.*` — отдельная задача
 * (см. TODO ниже). Сейчас бросаем понятную ошибку.
 *
 * TODO: когда понадобится spawning ped'ов из клиента (миссии, тестовые NPC)
 * — реализовать через `ccmp.natives.ped.createPed` + локальный id-counter +
 * `CCMPPed`-обёртку. Для синхронизированных ped'ов нужна server-side фабрика
 * с `ccmp.peds.create` и net-events для распространения id-mapping'а.
 */
export class CCMPPedsManager implements IPedsManager {
  // -- IPedsManager ---------------------------------------------------------

  public create(options: IPedCreateOptions): IPed {
    void options;
    throw new Error(
      "CCMPPedsManager.create: создание ped'ов на client-side под CCMP не поддерживается. " +
        "Используйте server-side `ccmp.peds.create` (см. server/entities/ccmp/ped/*), " +
        "либо вызывайте `ccmp.natives.ped.createPed` напрямую для локального ped-handle.",
    );
  }

  // -- IEntitiesManager -----------------------------------------------------

  public syncWithMpPool(): void {
    // No-op: client-side ped pool под CCMP отсутствует, синхронизировать нечего.
  }

  public registerById(id: number): IPed {
    throw new Error(
      `CCMPPedsManager.registerById(${id}): client-side ped pool под CCMP отсутствует, ` +
        "регистрировать ped по id невозможно.",
    );
  }

  public unregisterById(id: number): IPed {
    throw new Error(
      `CCMPPedsManager.unregisterById(${id}): client-side ped pool под CCMP отсутствует, ` +
        "разрегистрировать ped по id невозможно.",
    );
  }

  // -- IBaseObjectsManager / IWorldObjectsManager ---------------------------

  public findByID(id: number): IPed | null {
    void id;
    return null;
  }

  public getByID(id: number): IPed {
    throw new Error(`CCMPPedsManager.getByID(${id}): ped не найден (пул пуст под CCMP).`);
  }

  public findByRemoteID(remoteId: number): IPed | null {
    void remoteId;
    return null;
  }

  public getByRemoteID(remoteId: number): IPed {
    throw new Error(`CCMPPedsManager.getByRemoteID(${remoteId}): ped не найден (пул пуст под CCMP).`);
  }

  public deleteById(id: number): IPed {
    throw new Error(`CCMPPedsManager.deleteById(${id}): ped не найден (пул пуст под CCMP).`);
  }

  public get iterator(): IWorldObjectsIterator<IPed> {
    return this._iterator;
  }

  // Iterator реализован inline и возвращает пустые итераторы — hot path
  // `PedNametagController.render` → `PedRepository.getAllInRadius` теперь
  // тихо деградирует вместо падения на каждом render-tick'е.
  private readonly _iterator: IWorldObjectsIterator<IPed> = {
    all: (): IterableIterator<IPed> => EMPTY_PEDS[Symbol.iterator](),
    dimension: (): IterableIterator<IPed> => EMPTY_PEDS[Symbol.iterator](),
    range2D: (): IterableIterator<IPed> => EMPTY_PEDS[Symbol.iterator](),
    range3D: (): IterableIterator<IPed> => EMPTY_PEDS[Symbol.iterator](),
  };
}
