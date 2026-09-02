/// <reference types="@vimp-mp/types/client" />

import { type IZoneManager } from "../../common/zone/IZoneManager";
import { type IVector3D } from "@shared/common/utils";

/**
 * Реализация `IZoneManager` под VIMP.
 *
 * RageMP `mp.game.zone.getNameOfZone` маппится 1:1 на GTA V натив
 * `GET_NAME_OF_ZONE` (`0x7875CE91B4119A5F`), который в VIMP экспонирован
 * как `vimp.natives.zone.getNameOfZone`. Натив возвращает GXT-ключ зоны
 * (например, `"VINE"`, `"DOWNT"`, `"AIRP"`) — локализуется в UI через
 * `getLabelText(key)`.
 *
 * **Hot path:** вызывается ~раз в секунду из `HudController.onInterval` →
 * `HudService.syncCurrentLocation` → `LocationService.getLocationByCords`
 * → `RockModLocationAdapter.getRegionByCords`. Парная с
 * `VIMPPathfindManager.getStreetNameAtCoord`.
 */
export class VIMPZoneManager implements IZoneManager {
  public getNameOfZone(position: IVector3D): string {
    return vimp.natives.zone.getNameOfZone(position.x, position.y, position.z);
  }
}
