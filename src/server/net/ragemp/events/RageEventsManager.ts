import { IEventsManager } from "../../common/events/IEventsManager";
import { RagePlayer } from "../../../entities/ragemp/player/RagePlayer";

export class RageEventsManager implements IEventsManager {
  public on(eventName: string, listener: (...args: never[]) => void): void {
    return mp.events.add(eventName, listener);
  }

  public off(eventName: string, listener: (...args: unknown[]) => void): void {
    return mp.events.remove(eventName, listener);
  }

  public emit(eventName: string, ...args: unknown[]): void {
    return mp.events.call(eventName, args);
  }

  public emitClient(player: RagePlayer, eventName: string, ...args: unknown[]): void {
    return player.net.callEvent(eventName, ...args);
  }
}
