import { type IChatManager } from "../../common/chat/IChatManager";

export class CCMPChatManager implements IChatManager {
  public activate(_state: boolean): void {
    void _state;
    // CCMP currently does not expose chat activation controls to JS.
  }

  public show(_state: boolean): void {
    void _state;
    // CCMP currently does not expose chat visibility controls to JS.
  }

  public push(text: string): void {
    ccmp.notify(text);
  }
}
