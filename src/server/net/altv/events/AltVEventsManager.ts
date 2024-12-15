import { IEventsManager } from "../../common/events/IEventsManager";
import { IClientToServerEvents, IServerToClientEvents } from "@shared/net/common/events/types";
import { IServerInternalEvents } from "../../common/events/types";
import { AltVPlayer } from "@RockMod/server/entities/altv/player/AltVPlayer";
import Player = AltVServer.Player;

interface IAltVServerInternalEvents extends IServerInternalEvents, AltVServer.IServerEvent {}

export class AltVEventsManager implements IEventsManager {
  public onInternal(events: Partial<IAltVServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error Add types
      AltVServer.on(eventName, events[eventName]);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    AltVServer.off(eventName, listener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    AltVServer.emit(eventName, ...args);
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error Add types
      AltVServer.onClient(eventName, events[eventName]);
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    AltVServer.offClient(eventName, listener);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: AltVPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    const mpPlayer = Player.getByID(player.id);

    if (!mpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    return mpPlayer.emit(eventName, ...args);
  }
}
