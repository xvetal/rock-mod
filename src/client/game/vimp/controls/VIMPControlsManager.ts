/// <reference types="@vimp-mp/types/client" />

import { type IControlsManager } from "../../common/controls/IControlsManager";

/**
 * Реализация `IControlsManager` поверх натива-обёртки VIMP `vimp.natives.pad.*`.
 *
 * Все четыре метода — прямой passthrough к соответствующим GTA V-нативам
 * (`DISABLE_CONTROL_ACTION`, `IS_CONTROL_PRESSED`, `IS_DISABLED_CONTROL_PRESSED`,
 * `GET_DISABLED_CONTROL_NORMAL`) с сохранением порядка аргументов:
 *
 *   IControlsManager.disableControlAction(padIndex, control, disable)
 *     → vimp.natives.pad.disableControlAction(padIndex, control, disable)
 *
 * Семантика и значения индексов идентичны RageMP — гейм-mod консьюмеры
 * (`ControlsService` / `WeaponService.disableControlActions`) используют те
 * же константы `Control.*` (см. `@shared/common/enums/Control`).
 *
 * **Hot path:** `disableControlAction` вызывается на каждый render-tick из
 * `WeaponController.onRender`. VIMP-native — это синхронный вызов V8 op'а,
 * стоимость порядка единиц микросекунд; никакой буферизации не нужно.
 *
 * Имена параметров `VimpNativesPad.disableControlAction(control, action, ...)`
 * **обманчивы** — это generic-renames из натив-генератора. Фактически первый
 * аргумент — `padIndex` (0..2), второй — `control` (Control.*), третий —
 * `disable: boolean`. См. https://docs.fivem.net/natives/?_0xFE99B66D43DA8E7B.
 */
export class VIMPControlsManager implements IControlsManager {
  public disableControlAction(padIndex: number, control: number, disable: boolean): void {
    vimp.natives.pad.disableControlAction(padIndex, control, disable);
  }

  public isDisabledControlPressed(padIndex: number, control: number): boolean {
    return vimp.natives.pad.isDisabledControlPressed(padIndex, control);
  }

  public isDisabledControlJustPressed(padIndex: number, control: number): boolean {
    return vimp.natives.pad.isDisabledControlJustPressed(padIndex, control);
  }

  public isControlPressed(padIndex: number, control: number): boolean {
    return vimp.natives.pad.isControlPressed(padIndex, control);
  }

  public isControlJustPressed(padIndex: number, control: number): boolean {
    return vimp.natives.pad.isControlJustPressed(padIndex, control);
  }

  public isControlJustReleased(padIndex: number, control: number): boolean {
    return vimp.natives.pad.isControlJustReleased(padIndex, control);
  }

  public getDisabledControlNormal(padIndex: number, control: number): number {
    return vimp.natives.pad.getDisabledControlNormal(padIndex, control);
  }
}
