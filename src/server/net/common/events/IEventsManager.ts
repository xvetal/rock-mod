import { IPlayer } from "../../../entities/common/player/IPlayer";

export interface INetServerEvents {}

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
