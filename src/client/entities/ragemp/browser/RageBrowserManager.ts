import { type IBrowserManager } from "@RockMod/client/entities/common/browser/IBrowserManager";

export class RageBrowserManager implements IBrowserManager {
  private _browser: BrowserMp | null = null;

  public create(url: string): void {
    this._browser = mp.browsers.new(url);
  }

  public destroy(): void {
    if (this._browser) {
      this._browser.destroy();
      this._browser = null;
    }
  }

  public execute(code: string): void {
    if (this._browser) {
      this._browser.execute(code);
    }
  }
}
