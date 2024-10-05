import { IEventsManager, INetClientEvents, INetServerEvents } from "../../common/events/IEventsManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";
import alt = AltVServer;
import { AltVBaseObject } from "../../../entities/altv/baseObject/AltVBaseObject";

export interface IAltVServerEvents extends alt.IServerEvent, INetServerEvents {
  "rm::entityCreated"(baseObject: AltVBaseObject<alt.BaseObject>): void;
  "rm::entityDestroyed"(baseObject: AltVBaseObject<alt.BaseObject>): void;
}

export interface IAltVClientEvents extends INetClientEvents {}

export class AltVEventsManager implements IEventsManager {
  public on<K extends keyof IAltVServerEvents>(
    events: Record<K, (...args: Parameters<IAltVServerEvents[K]>) => void>,
  ): void {
    for (const eventName of Object.keys(events)) {
      alt.on(eventName, events[eventName as K]);
    }
  }

  public off<K extends keyof IAltVServerEvents>(
    eventName: K,
    listener: (...args: Parameters<IAltVServerEvents[K]>) => void,
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.off(eventName, listener);
  }

  public emit<K extends keyof IAltVServerEvents>(eventName: K, ...args: Parameters<IAltVServerEvents[K]>): void {
    return alt.emit(eventName as string, ...args);
  }

  public emitClient<K extends keyof IAltVClientEvents>(
    player: AltVPlayer,
    eventName: K,
    ...args: Parameters<IAltVClientEvents[K]>
  ): void {
    return player.net.emitEvent(eventName, ...args);
  }
}
