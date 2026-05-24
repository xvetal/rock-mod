import { type IBrowserHandle, type IBrowserManager } from "@RockMod/client/game/common/browser/IBrowserManager";

type RageBrowserWithOrder = BrowserMp & { orderId?: number };

class RageBrowserHandle implements IBrowserHandle {
  private _browser: RageBrowserWithOrder | null = null;

  public constructor(url: string) {
    this._browser = mp.browsers.new(url);
  }

  public get isAlive(): boolean {
    return this._browser !== null;
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

  public setOrderId(orderId: number): void {
    if (this._browser) {
      this._browser.orderId = orderId;
    }
  }
}

export class RageBrowserManager implements IBrowserManager {
  private _browser: IBrowserHandle | null = null;

  public create(url: string): void {
    this.destroy();
    this._browser = this.createInstance(url);
  }

  public createInstance(url: string): IBrowserHandle {
    return new RageBrowserHandle(url);
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
