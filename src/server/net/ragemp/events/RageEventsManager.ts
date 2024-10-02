import { IEventsManager, INetServerEvents } from "../../common/events/IEventsManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";
import { RageBaseObject } from "../../../entities/ragemp/baseObject/RageBaseObject";

interface RageServerEvents extends IServerEvents, INetServerEvents {
  "rm::playerConnected"(player: RagePlayer): void;
  "rm:playerDisconnected"(player: RagePlayer): void;
  "rm::entityCreated"(entity: RageBaseObject): void;
  "rm::entityDestroyed"(entity: RageBaseObject): void;
  playerJoin(player: PlayerMp): void;
  playerQuit(player: PlayerMp): void;
}

export class RageEventsManager implements IEventsManager {
  public on<K extends keyof RageServerEvents>(
    eventName: K,
    listener: (...args: Parameters<RageServerEvents[K]>) => void,
  ): void {
    return mp.events.add(eventName, listener);
  }

  public onServer<K extends keyof RageServerEvents>(
    eventName: K,
    listener: (...args: RageServerEvents[K][]) => void,
  ): void {
    return mp.events.add(eventName, listener);
  }

  public off(eventName: keyof RageServerEvents, listener: (...args: unknown[]) => void): void {
    return mp.events.remove(eventName, listener);
  }

  public emit(eventName: keyof RageServerEvents, ...args: unknown[]): void {
    return mp.events.call(eventName, args);
  }

  public emitClient(player: RagePlayer, eventName: keyof RageServerEvents, ...args: unknown[]): void {
    return player.net.callEvent(eventName, ...args);
  }
}
