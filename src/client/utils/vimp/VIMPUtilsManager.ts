/// <reference types="@vimp-mp/types/client" />

import { type IUtilsManager } from "../common/IUtilsManager";

/**
 * Реализация `IUtilsManager` под VIMP.
 *
 * `hash(value)` — обёртка вокруг `vimp.natives.misc.getHashKey(value)`,
 * который вызывает GTA V натив `GET_HASH_KEY` (joaat). Алгоритм идентичен
 * RageMP'шному `mp.game.joaat(value)`, так что результат бит-в-бит совпадает —
 * хеши моделей/нативов из shared-кода (`@shared/common/enums/Model`,
 * `WeaponHash.*`, etc.) валидны в обеих интеграциях.
 *
 * **Hot path:** `hash(weaponName)` вызывается каждый render-tick из
 * `WeaponAmmoDisplayService.renderAmmo` для резолва hash'а текущего оружия.
 * Это синхронный V8-op без аллокаций, стоимость — единицы микросекунд. JS-side
 * кешировать не нужно: натив сам кеширует на стороне Rust-рантайма.
 */
export class VIMPUtilsManager implements IUtilsManager {
  public hash(value: string): number {
    return vimp.natives.misc.getHashKey(value);
  }
}
