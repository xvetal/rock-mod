import { type IEventsManager } from "../../common/events/IEventsManager";
import { EventEmitter } from "events";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type MockPlayer } from "../../../entities/mock/player/MockPlayer";

export class MockEventsManager implements IEventsManager {
  private readonly _eventEmitter = new EventEmitter();

  public onInternal(events: Partial<IServerInternalEvents>): void {
    for (const [eventName, handler] of Object.entries(events)) {
      this._eventEmitter.on(eventName, handler as (...args: unknown[]) => void);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    this._eventEmitter.off(eventName, listener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    this._eventEmitter.emit(eventName, ...args);
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    for (const [eventName, handler] of Object.entries(events)) {
      this._eventEmitter.on(eventName, handler);
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    this._eventEmitter.off(eventName, listener);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: MockPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    this._eventEmitter.emit(eventName, player, ...args);
  }
}
