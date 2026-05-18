/// <reference types="@classic-mp/types/client" />

import { type IPathfindManager, type IStreetNameHash } from "../../common/pathfind/IPathfindManager";
import { type IVector3D } from "@shared/common/utils";

/**
 * Реализация `IPathfindManager` под CCMP.
 *
 * RageMP `mp.game.pathfind.getStreetNameAtCoord` маппится 1:1 на GTA V натив
 * `GET_STREET_NAME_AT_COORD` (`0x2EB41072B4C1E4C0`), который в CCMP экспонирован
 * как `ccmp.natives.pathfind.getStreetNameAtCoord`. Натив возвращает два хэша
 * локализационных GXT-ключей — улицу и пересекающую дорогу (или 0 для второй,
 * если в точке нет пересечения).
 *
 * **Hot path:** вызывается ~раз в секунду из `HudController.onInterval` →
 * `HudService.syncCurrentLocation` → `LocationService.getCurrentLocation` →
 * `LocationService.getLocationByCords` → `RockModLocationAdapter.getStreetByCords`.
 * Не render-tick, но всё равно высокая частота — синхронный native-call,
 * стоимость незначительная.
 *
 * ### Маппинг полей
 *
 * CCMP-натив возвращает `{streetname, crossingroad}` (lowercase, как в C++
 * биндинге), интерфейс `IStreetNameHash` ожидает `{streetName, crossingRoad}`
 * (camelCase). Переименовываем в return-statement.
 */
export class CCMPPathfindManager implements IPathfindManager {
  public getStreetNameAtCoord(position: IVector3D): IStreetNameHash {
    const result = ccmp.natives.pathfind.getStreetNameAtCoord(position.x, position.y, position.z);
    return {
      streetName: result.streetname,
      crossingRoad: result.crossingroad,
    };
  }
}
