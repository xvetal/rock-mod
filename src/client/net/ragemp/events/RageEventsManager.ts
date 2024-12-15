import { IEventsManager } from "../../common/events/IEventsManager";
import { IClientInternalEvents } from "@RockMod/client/net/common/events/types";
import { IClientToServerEvents, IServerToClientEvents } from "@shared/net/common/events/types";

interface IRageClientInternalEvents extends IClientInternalEvents, IClientEvents {}

export class RageEventsManager implements IEventsManager {
  public onInternal(events: Partial<IRageClientInternalEvents>): void {
    mp.events.add(events);
  }

  public offInternal<K extends keyof IRageClientInternalEvents>(
    eventName: K,
    listener: IRageClientInternalEvents[K],
  ): void {
    return mp.events.remove(eventName, listener);
  }

  public emitInternal<K extends keyof IRageClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IRageClientInternalEvents[K]>
  ): void {
    return mp.events.call(eventName, ...args);
  }

  public onServer(events: Partial<IServerToClientEvents>): void {
    return mp.events.add(events);
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener: IServerToClientEvents[K]): void {
    return mp.events.remove(eventName, listener);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    return mp.events.callRemote(eventName, ...args);
  }
}
