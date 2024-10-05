import { IEventsManager, INetClientEvents, INetServerEvents } from "../../common/events/IEventsManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";
import { RageBaseObject } from "../../../entities/ragemp/baseObject/RageBaseObject";

export interface IRageServerEvents extends IServerEvents, INetServerEvents {
  "rm::playerConnected"(player: RagePlayer): void;
  "rm::playerDisconnected"(player: RagePlayer): void;
  "rm::entityCreated"(entity: RageBaseObject): void;
  "rm::entityDestroyed"(entity: RageBaseObject): void;
  playerJoin(player: PlayerMp): void;
  playerQuit(player: PlayerMp): void;
}

export interface IRageClientEvents extends INetClientEvents {}

export class RageEventsManager implements IEventsManager {
  public on<K extends keyof IRageServerEvents>(
    events: Record<K, (...args: Parameters<IRageServerEvents[K]>) => void>,
  ): void {
    for (const eventName of Object.keys(events)) {
      mp.events.add(eventName, events[eventName as K]);
    }
  }

  public off<K extends keyof IRageServerEvents>(
    eventName: K,
    listener: (...args: Parameters<IRageServerEvents[K]>) => void,
  ): void {
    return mp.events.remove(eventName, listener);
  }

  public emit<K extends keyof IRageServerEvents>(eventName: K, ...args: Parameters<IRageServerEvents[K]>): void {
    return mp.events.call(eventName, ...args);
  }

  public emitClient<K extends keyof IRageClientEvents>(
    player: RagePlayer,
    eventName: K,
    ...args: Parameters<IRageClientEvents[K]>
  ): void {
    return player.net.emitEvent(eventName, ...args);
  }
}
