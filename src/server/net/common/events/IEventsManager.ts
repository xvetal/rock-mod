import { IPlayer } from "../../../entities/common/player/IPlayer";
import { IBaseObject } from "../../../entities/common/baseObject/IBaseObject";

export interface INetServerEvents {
  "rm::playerConnected"(player: IPlayer): void;
  "rm:playerDisconnected"(player: IPlayer): void;
  "rm::entityCreated"(entity: IBaseObject): void;
  "rm::entityDestroyed"(entity: IBaseObject): void;
}

export interface IEventsManager {
  on<K extends keyof INetServerEvents>(
    eventName: K,
    listener: (...args: Parameters<INetServerEvents[K]>) => void,
  ): void;
  onServer(eventName: string, listener: (...args: unknown[]) => void): void;
  off(eventName: string, listener: (...args: unknown[]) => void): void;
  emit(eventName: string, ...args: unknown[]): void;
  emitClient(player: IPlayer, eventName: string, ...args: unknown[]): void;
}
