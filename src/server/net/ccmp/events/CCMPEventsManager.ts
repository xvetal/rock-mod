import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type CCMPPlayer } from "../../../entities/ccmp/player/CCMPPlayer";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPEventsManager implements IEventsManager {
  public onInternal(_events: Partial<IServerInternalEvents>): void {
    notImplemented("CCMPEventsManager.onInternal");
  }

  public offInternal<K extends keyof IServerInternalEvents>(_eventName: K, _listener: IServerInternalEvents[K]): void {
    notImplemented("CCMPEventsManager.offInternal");
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    _eventName: K,
    ..._args: Parameters<IServerInternalEvents[K]>
  ): void {
    notImplemented("CCMPEventsManager.emitInternal");
  }

  public onClient(_events: Partial<IClientToServerEvents>): void {
    notImplemented("CCMPEventsManager.onClient");
  }

  public offClient<K extends keyof IClientToServerEvents>(_eventName: K, _listener: IClientToServerEvents[K]): void {
    notImplemented("CCMPEventsManager.offClient");
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    _player: CCMPPlayer,
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    notImplemented("CCMPEventsManager.emitClient");
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    notImplemented("CCMPEventsManager.emitAllClients");
  }
}
