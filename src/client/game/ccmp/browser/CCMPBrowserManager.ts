import { type Browser as CcmpBrowser } from "@classic-mp/types/client";
import { type IBrowserHandle, type IBrowserManager } from "../../common/browser/IBrowserManager";

class CCMPBrowserHandle implements IBrowserHandle {
  private _browser: CcmpBrowser | null;

  public constructor(url: string) {
    this._browser = ccmp.browsers.create(url);
  }

  public get isAlive(): boolean {
    return this._browser !== null;
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
  private _browser: IBrowserHandle | null = null;

  public create(url: string): void {
    this.destroy();
    this._browser = this.createInstance(url);
  }

  public createInstance(url: string): IBrowserHandle {
    return new CCMPBrowserHandle(url);
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
    this._browser.execute(code);
  }
}
