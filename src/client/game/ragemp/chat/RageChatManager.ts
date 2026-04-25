import { type IChatManager } from "@RockMod/client/game";

export class RageChatManager implements IChatManager {
  public activate(state: boolean): void {
    mp.gui.chat.activate(state);
  }

  public show(state: boolean): void {
    mp.gui.chat.show(state);
  }
}
