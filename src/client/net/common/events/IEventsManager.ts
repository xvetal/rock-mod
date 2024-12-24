import { type IServerToClientEvents, type IClientToServerEvents } from "@shared/net/common/events/types";
import { type IClientInternalEvents } from "./types";

export interface IEventsManager {
  onInternal(events: Partial<IClientInternalEvents>): void;
  offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener: IClientInternalEvents[K]): void;
  emitInternal<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void;

  onServer(events: Partial<IServerToClientEvents>): void;
  offServer<K extends keyof IServerToClientEvents>(eventName: K, listener: IServerToClientEvents[K]): void;
  emitServer<K extends keyof IClientToServerEvents>(eventName: K, ...args: Parameters<IClientToServerEvents[K]>): void;
}
