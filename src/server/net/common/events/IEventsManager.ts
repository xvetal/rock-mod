import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type IServerInternalEvents } from "./types";
import { type IPlayer } from "../../../entities";

export interface IEventsManager {
  onInternal(events: Partial<IServerInternalEvents>): void;
  offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void;
  emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void;

  onClient(events: Partial<IClientToServerEvents>): void;
  offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void;
  emitClient<K extends keyof IServerToClientEvents>(
    player: IPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void;
  emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void;
}
