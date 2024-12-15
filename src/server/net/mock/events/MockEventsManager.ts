import { IEventsManager } from "../../common/events/IEventsManager";
import { EventEmitter } from "events";
import { IServerInternalEvents } from "@RockMod/server/net/common/events/types";
import { IClientToServerEvents, IServerToClientEvents } from "@shared/net/common/events/types";
import { MockPlayer } from "@RockMod/server/entities/mock/player/MockPlayer";

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
