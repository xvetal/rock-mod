import { type IBrowserHandle } from "../../common/browser/IBrowserManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxBrowserHandle implements IBrowserHandle {
  public get isAlive(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserHandle.isAlive");
  }

  public execute(_code: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserHandle.execute");
  }

  public destroy(): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserHandle.destroy");
  }

  public setOrderId(_orderId: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxBrowserHandle.setOrderId");
  }
}
