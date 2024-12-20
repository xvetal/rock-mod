import { IClientToServerEvents, IServerToClientEvents } from "../../../../shared";
import { IServerInternalEvents } from "./types";
import { IPlayer } from "../../../entities";

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
}
