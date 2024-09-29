import { IPlayer } from "../../../entities/common/player/IPlayer";

export interface IEventsManager {
  on(eventName: string, listener: (...args: unknown[]) => void): void;
  off(eventName: string, listener: (...args: unknown[]) => void): void;
  emit(eventName: string, ...args: unknown[]): void;
  emitClient(player: IPlayer, eventName: string, ...args: unknown[]): void;
}
