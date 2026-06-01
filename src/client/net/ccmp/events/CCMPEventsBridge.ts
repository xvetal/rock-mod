/// <reference types="@classic-mp/types/client" />
import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { type CCMPEventsManager } from "./CCMPEventsManager";

/**
 * Legacy bridge slot for CCMP raw events.
 *
 * Player lifecycle and stream events are handled by `CCMPPlayersManager`,
 * because it can resolve every native `ccmp.players.Player` into the stable
 * Rock-Mod `CCMPPlayer` instance before emitting internal `rm::*` events.
 */
export class CCMPEventsBridge implements IEventsBridge {
  public constructor(events: CCMPEventsManager) {
    void events;
  }

  public registerRawEvents(): void {
    // Intentionally empty. See class comment.
  }

  public registerServerEvents(): void {
    // No-op: ранее тут жил handler для cooperation `rm::clientReady`-ответа.
    // Теперь это responsibility `CCMPPlayersManager`.
  }
}
