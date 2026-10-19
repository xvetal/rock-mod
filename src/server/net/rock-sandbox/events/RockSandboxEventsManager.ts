import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IPlayer } from "../../../entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEventsManager implements IEventsManager {
  public onInternal(_events: Partial<IServerInternalEvents>): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.onInternal");
  }

  public offInternal<K extends keyof IServerInternalEvents>(_eventName: K, _listener: IServerInternalEvents[K]): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.offInternal");
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    _eventName: K,
    ..._args: Parameters<IServerInternalEvents[K]>
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.emitInternal");
  }

  public onClient(_events: Partial<IClientToServerEvents>): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.onClient");
  }

  public offClient<K extends keyof IClientToServerEvents>(_eventName: K, _listener: IClientToServerEvents[K]): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.offClient");
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    _player: IPlayer,
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.emitClient");
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxEventsManager.emitAllClients");
  }
}
