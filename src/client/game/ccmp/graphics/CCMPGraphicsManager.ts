/// <reference types="@classic-mp/types/client" />

import { type IGraphicsManager, type IScreenTextOptions } from "../../common/graphics/IGraphicsManager";
import { type IVector2D, type IVector3D, Vector2D } from "@shared/common/utils";

/**
 * Реализация `IGraphicsManager` под CCMP.
 *
 * RageMP даёт высокоуровневые обёртки `mp.game.graphics.drawText` /
 * `world3dToScreen2d` / etc. У CCMP таких помощников нет — есть только
 * сырые GTA V натив-биндинги в `ccmp.natives.{hud,graphics}.*`. Этот класс
 * собирает их в эквивалент RageMP API.
 *
 * ### `drawText` — мульти-нативная цепочка
 *
 * Стандартная GTA V последовательность:
 *  1. `SET_TEXT_FONT/SCALE/COLOUR/OUTLINE/CENTRE` — стиль текста
 *  2. `BEGIN_TEXT_COMMAND_DISPLAY_TEXT('STRING')` — открыть text command
 *  3. `ADD_TEXT_COMPONENT_SUBSTRING_PLAYER_NAME(text)` — добавить содержимое
 *  4. `END_TEXT_COMMAND_DISPLAY_TEXT(x, y, 0)` — отрисовать
 *
 * **Hot path:** вызывается каждый render-tick из `HudController.onRender`
 * (ammo, nametags, etc). Все вызовы синхронны (V8-ops), общая стоимость —
 * единицы микросекунд на текст.
 *
 * **Ограничение длины:** `ADD_TEXT_COMPONENT_SUBSTRING_PLAYER_NAME` усекает
 * вход на 99 символов. Для типичных HUD-меток (ammo "30/120", имена игроков)
 * не критично; для длинных строк нужно разбивать на чанки последовательными
 * `ADD_*` вызовами. Сейчас не реализовано — добавим если понадобится.
 *
 * ### `world3dToScreen2d`
 *
 * `getScreenCoordFromWorldCoord` возвращает `{return, screenx, screeny}` —
 * `return=false` означает, что точка вне frustum'а; маппим в `null` для
 * совпадения с RageMP-семантикой.
 *
 * ### `getActiveScreenResolution`
 *
 * Маппится на `getActualScreenResolution` (GTA native `0x873C9F3104101DD3`),
 * который возвращает физическое разрешение рендера — то же, что RageMP'шный
 * `getActiveScreenResolution` (это один и тот же натив, переименованный по-
 * разному в разных биндингах).
 *
 * ### `startScreenEffect` / `stopScreenEffect`
 *
 * Маппятся на `animpostfxPlay` / `animpostfxStop` (`ANIMPOSTFX_PLAY`/`STOP`) —
 * это и есть GTA V натив для screen effect'ов (по-старому называвшийся
 * `START_SCREEN_EFFECT`).
 */
export class CCMPGraphicsManager implements IGraphicsManager {
  public drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void {
    const font = options?.font ?? 0;
    const [scaleX, scaleY] = options?.scale ?? [0.3, 0.3];
    const r = options?.color?.r ?? 255;
    const g = options?.color?.g ?? 255;
    const b = options?.color?.b ?? 255;
    const a = options?.color?.a ?? 255;
    const outline = options?.outline ?? true;
    const centre = options?.centre ?? false;

    const hud = ccmp.natives.hud;

    hud.setTextFont(font);
    // Натив `SET_TEXT_SCALE(scale, size)` — первый параметр обычно игнорируется,
    // эффективный размер задаётся вторым. RageMP передаёт оба из массива
    // `[scaleX, scaleY]` — повторяем тот же контракт.
    hud.setTextScale(scaleX, scaleY);
    hud.setTextColour(r, g, b, a);
    if (outline) {
      hud.setTextOutline();
    }
    if (centre) {
      hud.setTextCentre(true);
    }

    hud.beginTextCommandDisplayText("STRING");
    hud.addTextComponentSubstringPlayerName(text);
    // p2 — `unk_const_0` (введён в b2699); 0 — стандартное значение.
    hud.endTextCommandDisplayText(position.x, position.y, 0);
  }

  public world3dToScreen2d(position: IVector3D): IVector2D | null {
    const result = ccmp.natives.graphics.getScreenCoordFromWorldCoord(position.x, position.y, position.z);
    if (!result.return) {
      // Точка вне frustum'а — RageMP в таком случае возвращает `null`.
      return null;
    }
    return new Vector2D(result.screenx, result.screeny);
  }

  public startScreenEffect(effectName: string, duration: number, looped: boolean): void {
    ccmp.natives.graphics.animpostfxPlay(effectName, duration, looped);
  }

  public stopScreenEffect(effectName: string): void {
    ccmp.natives.graphics.animpostfxStop(effectName);
  }

  public getSafeZoneSize(): number {
    return ccmp.natives.graphics.getSafeZoneSize();
  }

  public getActiveScreenResolution(): IVector2D {
    // `getActualScreenResolution` (0x873C9F3104101DD3) === RageMP'шный
    // `getActiveScreenResolution` — это один и тот же native под разными
    // именами в разных биндингах.
    const result = ccmp.natives.graphics.getActualScreenResolution();
    return new Vector2D(result.x, result.y);
  }
}
