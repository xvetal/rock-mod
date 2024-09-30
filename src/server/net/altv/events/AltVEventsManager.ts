import { IEventsManager, INetServerEvents } from "../../common/events/IEventsManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";
import alt = AltVServer;

interface IAltVServerEvent extends alt.IServerEvent, INetServerEvents {
  entityCreated(baseObject: alt.BaseObject): void;
  entityDestroyed(baseObject: alt.BaseObject): void;
}

export class AltVEventsManager implements IEventsManager {
  public on<K extends keyof IAltVServerEvent>(
    eventName: K,
    listener: (...args: Parameters<IAltVServerEvent[K]>) => void,
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.on(eventName, listener);
  }

  public onServer<K extends keyof IAltVServerEvent>(
    eventName: K,
    listener: (...args: Parameters<IAltVServerEvent[K]>) => void,
  ): void {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return alt.on(eventName, listener);
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
