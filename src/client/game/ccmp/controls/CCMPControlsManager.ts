/// <reference types="@classic-mp/types/client" />

import { type IControlsManager } from "../../common/controls/IControlsManager";

/**
 * Реализация `IControlsManager` поверх натива-обёртки CCMP `ccmp.natives.pad.*`.
 *
 * Все четыре метода — прямой passthrough к соответствующим GTA V-нативам
 * (`DISABLE_CONTROL_ACTION`, `IS_CONTROL_PRESSED`, `IS_DISABLED_CONTROL_PRESSED`,
 * `GET_DISABLED_CONTROL_NORMAL`) с сохранением порядка аргументов:
 *
 *   IControlsManager.disableControlAction(padIndex, control, disable)
 *     → ccmp.natives.pad.disableControlAction(padIndex, control, disable)
 *
 * Семантика и значения индексов идентичны RageMP — гейм-mod консьюмеры
 * (`ControlsService` / `WeaponService.disableControlActions`) используют те
 * же константы `Control.*` (см. `@shared/common/enums/Control`).
 *
 * **Hot path:** `disableControlAction` вызывается на каждый render-tick из
 * `WeaponController.onRender`. CCMP-native — это синхронный вызов V8 op'а,
 * стоимость порядка единиц микросекунд; никакой буферизации не нужно.
 *
 * Имена параметров `CcmpNativesPad.disableControlAction(control, action, ...)`
 * **обманчивы** — это generic-renames из натив-генератора. Фактически первый
 * аргумент — `padIndex` (0..2), второй — `control` (Control.*), третий —
 * `disable: boolean`. См. https://docs.fivem.net/natives/?_0xFE99B66D43DA8E7B.
 */
export class CCMPControlsManager implements IControlsManager {
  public disableControlAction(padIndex: number, control: number, disable: boolean): void {
    ccmp.natives.pad.disableControlAction(padIndex, control, disable);
  }

  public isDisabledControlPressed(padIndex: number, control: number): boolean {
    return ccmp.natives.pad.isDisabledControlPressed(padIndex, control);
  }

  public isControlPressed(padIndex: number, control: number): boolean {
    return ccmp.natives.pad.isControlPressed(padIndex, control);
  }

  public getDisabledControlNormal(padIndex: number, control: number): number {
    return ccmp.natives.pad.getDisabledControlNormal(padIndex, control);
  }
}
