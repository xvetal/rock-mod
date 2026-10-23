import { type IBrowserManager, type IBrowserHandle } from "../../common/browser/IBrowserManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapBrowser } from "./RockSandboxBrowserHandle";

export class RockSandboxBrowserManager implements IBrowserManager {
  private _browser: IBrowserHandle | null = null;

  public create(url: string): void {
    this.destroy();
    this._browser = this.createInstance(url);
  }

  public createInstance(url: string): IBrowserHandle {
    return wrapBrowser(getRockSandbox().browsers.create(url));
  }

  public destroy(): void {
    this._browser?.destroy();
    this._browser = null;
  }

  public execute(code: string): void {
    this._browser?.execute(code);
  }
}
