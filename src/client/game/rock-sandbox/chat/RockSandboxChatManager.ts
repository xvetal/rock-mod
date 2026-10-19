import { type IChatManager } from "../../common/chat/IChatManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxChatManager implements IChatManager {
  public activate(_state: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxChatManager.activate");
  }

  public show(_state: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxChatManager.show");
  }

  public push(_text: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxChatManager.push");
  }
}
