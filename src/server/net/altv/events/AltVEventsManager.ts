import { IEventsManager, INetServerEvents } from "../../common/events/IEventsManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";
import alt = AltVServer;
import { AltVBaseObject } from "../../../entities/altv/baseObject/AltVBaseObject";

interface IAltVServerEvent extends alt.IServerEvent, INetServerEvents {
  "rm::entityCreated"(baseObject: AltVBaseObject<alt.BaseObject>): void;
  "rm::entityDestroyed"(baseObject: AltVBaseObject<alt.BaseObject>): void;
}

export class AltVEventsManager implements IEventsManager {
  public on<K extends keyof IAltVServerEvent>(
    events: Record<K, (...args: Parameters<IAltVServerEvent[K]>) => void>,
  ): void {
    for (const eventName of Object.keys(events)) {
      alt.on(eventName, events[eventName as K]);
    }
  }

  public onServer<K extends keyof IAltVServerEvent>(
    events: Record<K, (...args: Parameters<IAltVServerEvent[K]>) => void>,
  ): void {
    for (const eventName of Object.keys(events)) {
      alt.on(eventName, events[eventName as K]);
    }
  }

  public off(eventName: keyof IAltVServerEvent, listener: (...args: unknown[]) => void): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.off(eventName, listener);
  }

  public emit(eventName: keyof IAltVServerEvent, ...args: unknown[]): void {
    return alt.emit(eventName as string, ...args);
  }

  public emitClient(player: AltVPlayer, eventName: keyof IAltVServerEvent, ...args: unknown[]): void {
    return player.net.callEvent(eventName, ...args);
  }
}
