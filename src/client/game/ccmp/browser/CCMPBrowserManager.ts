import { type Browser as CcmpBrowser } from "@classic-mp/types/client";
import { type IBrowserManager } from "../../common/browser/IBrowserManager";

/**
 * Реализация `IBrowserManager` поверх нативного CCMP browser API.
 *
 * CCMP предоставляет полноценное CEF-управление через `ccmp.browsers` —
 * это прямое соответствие RageMP'шному `mp.browsers`. Маппинг:
 *  - `create(url)` → `ccmp.browsers.create(url)` → возвращает `Browser` с
 *    числовым `id`, который мы храним для последующих `execute`/`destroy`.
 *  - `execute(code)` → `Browser.executeJavaScript(code)`.
 *  - `destroy()` → `Browser.destroy()`.
 *
 * Геймод-консьюмер (`BrowserService` → один логический браузер на гейм-mod)
 * управляет только одним инстансом одновременно, поэтому держим ссылку
 * на единственный созданный браузер.
 */
export class CCMPBrowserManager implements IBrowserManager {
  private _browser: CcmpBrowser | null = null;

  public create(url: string): void {
    // На случай повторного create без destroy — закрываем предыдущий, чтобы
    // не оставлять висящий CEF-инстанс (этот контракт зеркалит поведение
    // `RageBrowserManager.create` — он тоже перезаписывает `_browser`).
    if (this._browser) {
      try {
        this._browser.destroy();
      } catch {
        // Если CEF уже отвалился — игнорируем.
      }
      this._browser = null;
    }

    this._browser = ccmp.browsers.create(url);
  }

  public destroy(): void {
    if (!this._browser) {
      return;
    }
    this._browser.destroy();
    this._browser = null;
  }

  public execute(code: string): void {
    if (!this._browser) {
      return;
    }
    this._browser.executeJavaScript(code);
  }
}
