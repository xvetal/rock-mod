import { type INametagsManager } from "../../common/nametags/INametagsManager";

/**
 * No-op реализация `INametagsManager` под CCMP.
 *
 * У RageMP клиента есть `mp.nametags.enabled` плюс отдельный API для
 * кастомного рендера (`mp.nametags.set(...)`). У CCMP **нет нативного API
 * для nametag'ов** — ни built-in отрисовки имён над головами, ни доступа
 * к screen-space координатам игроков из JS.
 *
 * Бросать нельзя: геймод-контроллер `NametagController` вызывает
 * `setEnabled(true)` в `@OnReady` хуке, и исключение поднимет весь bootstrap.
 * Поэтому молча игнорируем + один раз пишем warn, чтобы было видно в логах
 * что фича недоступна.
 *
 * Следствие: под CCMP над головами игроков не будет имён. Это known
 * limitation из плана интеграции. Долгосрочный фикс — нативная отрисовка
 * на стороне CCMP-клиента (Rust) или, как минимум, экспонирование
 * world-to-screen матриц через `ccmp.natives` для ручного рендера.
 */
export class CCMPNametagsManager implements INametagsManager {
  private _warned = false;

  public setEnabled(enabled: boolean): void {
    if (this._warned) {
      return;
    }
    this._warned = true;
    console.warn(
      `[CCMPNametagsManager] setEnabled(${String(enabled)}) вызван, но CCMP ` +
        `не предоставляет nametag API. Имена над головами игроков отображаться не будут.`,
    );
  }
}
