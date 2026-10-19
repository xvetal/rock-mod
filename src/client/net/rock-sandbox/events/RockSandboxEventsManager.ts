import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerToClientEvents, type IClientToServerEvents } from "../../../../shared/net/common/events/types";
import { type IClientInternalEvents } from "../../common/events/types";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEventsManager implements IEventsManager {
  public onRaw(_events: Partial<IClientEvents>): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.onRaw");
  }

  public offRaw<K extends keyof IClientEvents>(_eventName: K, _listener?: IClientEvents[K]): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.offRaw");
  }

  public onInternal(_events: Partial<IClientInternalEvents>): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.onInternal");
  }

  public offInternal<K extends keyof IClientInternalEvents>(_eventName: K, _listener?: IClientInternalEvents[K]): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.offInternal");
  }

  public emitInternal<K extends keyof IClientInternalEvents>(
    _eventName: K,
    ..._args: Parameters<IClientInternalEvents[K]>
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.emitInternal");
  }

  public onServer(_events: Partial<IServerToClientEvents>): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.onServer");
  }

  public offServer<K extends keyof IServerToClientEvents>(_eventName: K, _listener?: IServerToClientEvents[K]): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.offServer");
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    _eventName: K,
    ..._args: Parameters<IClientToServerEvents[K]>
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.emitServer");
  }

  public register(_event: string, _listener: (...args: unknown[]) => void): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.register");
  }

  public unregister(_event: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxEventsManager.unregister");
  }
}
