/// <reference types="@classic-mp/types/client" />

import { type IUiManager } from "../../common/ui/IUiManager";
import { type IVector3D, Vector3D } from "@shared/common/utils";

/**
 * Реализация `IUiManager` под CCMP. Большинство методов — прямой passthrough
 * к `ccmp.natives.hud.*` (cрезом GTA V нативов HUD-намespace'а).
 *
 * **Hot path:** `hideHudComponentThisFrame(componentIndex)` вызывается каждый
 * render-tick из `HudService.render` → `_hideHudComponents`. CCMP-native —
 * синхронный V8-op, стоимость незначительная.
 *
 * ### Пробелы в CCMP-нативах
 *
 * `getLabelText(labelName)` — GTA V натив `_GET_LABEL_TEXT` (0x7B5280EBA9840C72)
 * **не экспонирован** в CCMP-биндингах (см. `@classic-mp/types/natives`).
 * Этот натив резолвит локализационный label из game GXT-таблиц — без него
 * мы не можем достать перевод. Возвращаем сам `labelName` как fallback и
 * один раз варнём в консоль — UI-консьюмер (скорее всего, что-то вроде
 * weapon-display или street-name) получит непереведённый ключ, что лучше
 * пустой строки или падения.
 *
 * TODO: при появлении `getLabelText` в `@classic-mp/types/natives.hud` или
 * `natives.localization` — заменить fallback на реальный вызов.
 *
 * ### `deleteWaypoint` под CCMP
 *
 * RageMP-натив `deleteWaypoint()` — алиас для `SET_WAYPOINT_OFF` (
 * `0xA7E4E2D361C2627F`). CCMP экспонирует его как `setWaypointOff`.
 */
export class CCMPUiManager implements IUiManager {
  /** Глобальный набор для one-time варнингов, чтобы не флудить лог. */
  private static readonly _warnedMethods = new Set<string>();

  public getStreetNameFromHashKey(hash: number): string {
    return ccmp.natives.hud.getStreetNameFromHashKey(hash);
  }

  public getLabelText(labelName: string): string {
    // _GET_LABEL_TEXT не доступен в CCMP — отдаём ключ как fallback.
    CCMPUiManager._warnOnce(
      "getLabelText",
      "[CCMPUiManager] getLabelText() не реализован в CCMP-нативах — " +
        "возвращаем сам labelName как fallback. Локализованных строк не будет.",
    );
    return labelName;
  }

  public hideHudComponentThisFrame(componentIndex: number): void {
    ccmp.natives.hud.hideHudComponentThisFrame(componentIndex);
  }

  public displayRadar(display: boolean): void {
    ccmp.natives.hud.displayRadar(display);
  }

  public setPauseMenuActive(toggle: boolean): void {
    ccmp.natives.hud.setPauseMenuActive(toggle);
  }

  public setWaypoint(x: number, y: number): void {
    ccmp.natives.hud.setNewWaypoint(x, y);
  }

  public deleteWaypoint(): void {
    // RageMP `deleteWaypoint()` === GTA `SET_WAYPOINT_OFF`. CCMP экспонирует
    // под именем `setWaypointOff`.
    ccmp.natives.hud.setWaypointOff();
  }

  public getBlipInfoIdCoord(blip: number): IVector3D {
    const { x, y, z } = ccmp.natives.hud.getBlipInfoIdCoord(blip);
    return new Vector3D(x, y, z);
  }

  private static _warnOnce(method: string, message: string): void {
    if (CCMPUiManager._warnedMethods.has(method)) {
      return;
    }
    CCMPUiManager._warnedMethods.add(method);
    console.warn(message);
  }
}
