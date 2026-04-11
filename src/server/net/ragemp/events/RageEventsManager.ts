import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type RagePlayer } from "../../../entities/ragemp/player/RagePlayer";

interface IRageServerInternalEvents extends IServerInternalEvents, IServerEvents {}

export class RageEventsManager implements IEventsManager {
  public onInternal(events: Partial<IRageServerInternalEvents>): void {
    mp.events.add(events);
  }

  public offInternal<K extends keyof IRageServerInternalEvents>(eventName: K): void {
    mp.events.remove(eventName);
  }

  public emitInternal<K extends keyof IRageServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IRageServerInternalEvents[K]>
  ): void {
    mp.events.call(eventName, ...args);
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    mp.events.add(events);
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K): void {
    mp.events.remove(eventName);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: RagePlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    const mpPlayer = mp.players.at(player.id);

    if (!mpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    return mpPlayer.call(eventName, args);
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    mp.players.forEach((mpPlayer) => {
      mpPlayer.call(eventName, args);
    });
  }
}
