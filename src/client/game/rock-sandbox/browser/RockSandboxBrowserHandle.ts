import { type IBrowserHandle } from "../../common/browser/IBrowserManager";
import { type RockSandboxBrowser } from "@rock-sandbox/types/client";

export class RockSandboxBrowserHandle implements IBrowserHandle {
  public constructor(private readonly _nativeBrowser: RockSandboxBrowser) {}

  public get isAlive(): boolean {
    return this._nativeBrowser.isAlive;
  }

  public execute(code: string): void {
    this._nativeBrowser.executeJavaScript(code);
  }

  public destroy(): void {
    this._nativeBrowser.destroy();
  }

  public setOrderId(orderId: number): void {
    this._nativeBrowser.setOrderId(orderId);
  }
}

const handles = new WeakMap<RockSandboxBrowser, RockSandboxBrowserHandle>();
export function wrapBrowser(browser: RockSandboxBrowser): RockSandboxBrowserHandle {
  let handle = handles.get(browser);
  if (!handle) {
    handle = new RockSandboxBrowserHandle(browser);
    handles.set(browser, handle);
  }
  return handle;
}
