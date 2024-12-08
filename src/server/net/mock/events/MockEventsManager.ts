import { IEventsManager, INetClientEvents, INetServerEvents } from "../../common/events/IEventsManager";
import { EventEmitter } from "events";
import { MockPlayer } from "../../../entities/mock/player/MockPlayer";
import { MockBaseObject } from "../../../entities/mock/baseObject/MockBaseObject";

export interface IMockServerEvents extends INetServerEvents {
  "rm::playerConnected"(player: MockPlayer): void;
  "rm::playerDisconnected"(player: MockPlayer): void;
  "rm::entityCreated"(entity: MockBaseObject): void;
  "rm::entityDestroyed"(entity: MockBaseObject): void;
}

export interface IMockClientEvents extends INetClientEvents {}

export class MockEventsManager implements IEventsManager {
  private readonly _eventEmitter = new EventEmitter();

  public on<K extends keyof IMockServerEvents>(
    events: Record<K, (...args: Parameters<IMockServerEvents[K]>) => void>,
  ): void {
    for (const [eventName, handler] of Object.entries(events)) {
      this._eventEmitter.on(eventName, handler as (...args: unknown[]) => void);
    }
  }

  public off<K extends keyof IMockServerEvents>(
    eventName: K,
    listener: (...args: Parameters<IMockServerEvents[K]>) => void,
  ): void {
    this._eventEmitter.off(eventName, listener as (...args: unknown[]) => void);
  }

  public emit<K extends keyof IMockServerEvents>(eventName: K, ...args: Parameters<IMockServerEvents[K]>): void {
    this._eventEmitter.emit(eventName, ...args);
  }

  public emitClient(): void {
    throw new Error("Method not implemented");
  }
}
