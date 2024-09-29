import { IEventsManager } from "../../common/events/IEventsManager";
import { AltVPlayer } from "../../../entities/altv/player/AltVPlayer";

export class AltVEventsManager implements IEventsManager {
  public on(eventName: string, listener: (...args: unknown[]) => void): void {
    return alt.on(eventName, listener);
  }

  public off(eventName: string, listener: (...args: unknown[]) => void): void {
    return alt.off(eventName, listener);
  }

  public emit(eventName: string, ...args: unknown[]): void {
    return alt.emit(eventName, ...args);
  }

  public emitClient(player: AltVPlayer, eventName: string, ...args: unknown[]): void {
    return player.net.callEvent(eventName, ...args);
  }
}
