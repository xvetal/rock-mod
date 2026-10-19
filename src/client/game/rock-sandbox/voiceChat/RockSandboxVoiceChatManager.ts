import { type IVoiceChatManager } from "../../common/voiceChat/IVoiceChatManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxVoiceChatManager implements IVoiceChatManager {
  public getMuted(): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxVoiceChatManager.getMuted");
  }

  public setMuted(_value: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxVoiceChatManager.setMuted");
  }
}
