import { type IBrowserManager, type IBrowserHandle } from "../../common/browser/IBrowserManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBrowserManager implements IBrowserManager {
  public create(_url: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserManager.create");
  }

  public createInstance(_url: string): IBrowserHandle {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserManager.createInstance");
  }

  public destroy(): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserManager.destroy");
  }

  public execute(_code: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserManager.execute");
  }
}
