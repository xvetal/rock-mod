import { type IVoiceChatManager } from "@RockMod/client/game";

export class RageVoiceChatManager implements IVoiceChatManager {
  public getMuted(): boolean {
    return mp.voiceChat.muted;
  }

  public setMuted(value: boolean): void {
    mp.voiceChat.muted = value;
  }
}
