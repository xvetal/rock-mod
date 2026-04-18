import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientInternalEvents } from "@RockMod/client/net/common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "@shared/net/common/events/types";

export class RageEventsManager implements IEventsManager {
  public onRaw(events: Partial<IClientEvents>): void {
    mp.events.add(events);
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    mp.events.remove(eventName, listener);
  }

  public onInternal(events: Partial<IClientInternalEvents>): void {
    mp.events.add(events);
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    return mp.events.remove(eventName, listener);
  }

  public emitInternal<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    return mp.events.call(eventName, ...args);
  }

  public onServer(events: Partial<IServerToClientEvents>): void {
    return mp.events.add(events);
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener?: IServerToClientEvents[K]): void {
    return mp.events.remove(eventName, listener);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    return mp.events.callRemote(eventName, ...args);
  }

  public register(event: string, listener: (...args: object[]) => void): void {
    mp.events.add(event, listener);
  }

  public unregister(event: string): void {
    mp.events.remove(event);
  }
}
