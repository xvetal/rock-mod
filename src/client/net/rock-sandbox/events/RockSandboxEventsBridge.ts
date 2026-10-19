import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEventsBridge implements IEventsBridge {
  public registerRawEvents(): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsBridge.registerRawEvents");
  }

  public registerServerEvents(): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsBridge.registerServerEvents");
  }
}
