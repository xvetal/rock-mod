import { IPlayer } from "../../../entities/common/player/IPlayer";
import { IBaseObject } from "../../../entities/common/baseObject/IBaseObject";

export interface INetServerEvents {
  "rm::playerConnected"(player: IPlayer): void;
  "rm::playerDisconnected"(player: IPlayer): void;
  "rm::entityCreated"(entity: IBaseObject): void;
  "rm::entityDestroyed"(entity: IBaseObject): void;
}

export interface INetClientEvents {}

export interface IEventsManager {
  on<K extends keyof INetServerEvents>(events: Record<K, (...args: Parameters<INetServerEvents[K]>) => void>): void;
  off<K extends keyof INetServerEvents>(
    eventName: K,
    listener: (...args: Parameters<INetServerEvents[K]>) => void,
  ): void;
  emit<K extends keyof INetServerEvents>(eventName: K, ...args: Parameters<INetServerEvents[K]>): void;
  emitClient<K extends keyof INetClientEvents>(
    player: IPlayer,
    eventName: K,
    ...args: Parameters<INetClientEvents[K]>
  ): void;
}
