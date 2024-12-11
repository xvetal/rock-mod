import { IEventsManager, INetClientEvents } from "../../common/events/IEventsManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";
import { RageBaseObject } from "../../../entities/ragemp/baseObject/RageBaseObject";

export interface IRageClientEvents extends IClientEvents, INetClientEvents {
  "rm::playerConnected"(player: RagePlayer): void;
  "rm::playerDisconnected"(player: RagePlayer): void;
  "rm::entityCreated"(entity: RageBaseObject): void;
  "rm::entityDestroyed"(entity: RageBaseObject): void;
  playerJoin(player: PlayerMp): void;
  playerQuit(player: PlayerMp): void;
}

export class RageEventsManager implements IEventsManager {
  public on(events: Record<string, (...args: unknown[]) => void>): void {
    mp.events.add(events);
  }

  public off(eventName: string, listener: (...args: unknown[]) => void): void {
    return mp.events.remove(eventName, listener);
  }

  public emit(eventName: string, ...args: unknown[]): void {
    return mp.events.call(eventName, ...args);
  }

  public emitServer(eventName: string, ...args: unknown[]): void {
    return mp.events.callRemote(eventName, ...args);
  }
}
