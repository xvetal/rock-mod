import { IBaseObject, IPlayer } from "../../../entities/common";

export interface INetClientEvents {
  "rm::playerConnected"(player: IPlayer): void;
  "rm::playerDisconnected"(player: IPlayer): void;
  "rm::entityCreated"(entity: IBaseObject): void;
  "rm::entityDestroyed"(entity: IBaseObject): void;
}

export interface IEventsManager {
  on(events: Record<string, (...args: unknown[]) => void>): void;
  off(eventName: string, listener: (...args: unknown[]) => void): void;
  emit(eventName: string, ...args: unknown[]): void;
  emitServer(eventName: string, ...args: unknown[]): void;
}
