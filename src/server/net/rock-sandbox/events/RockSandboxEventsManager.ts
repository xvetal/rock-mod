import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IPlayer } from "../../../entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

type InternalListener = IServerInternalEvents[keyof IServerInternalEvents];

interface IRockSandboxEventsAPI {
  on(eventName: string, listener: InternalListener): void;
  off(eventName: string, listener: InternalListener): void;
  emit(eventName: string, ...args: unknown[]): void;
}

function nativeEvents(member: string): IRockSandboxEventsAPI {
  const candidate: unknown = Reflect.get(globalThis, "rockSandbox");
  const api = candidate as Partial<IRockSandboxEventsAPI> | null | undefined;
  if (
    typeof api !== "object" ||
    api === null ||
    typeof api.on !== "function" ||
    typeof api.off !== "function" ||
    typeof api.emit !== "function"
  ) {
    throw new Error(
      `[RockSandbox:server] RockSandboxEventsManager.${member}: native event API is unavailable. ` +
        "Run inside Rock Sandbox with nodejs and rebuild the runtime with python3 scripts/nodejs.py build.",
    );
  }
  return api as IRockSandboxEventsAPI;
}

export class RockSandboxEventsManager implements IEventsManager {
  public onInternal(events: Partial<IServerInternalEvents>): void {
    const api = nativeEvents("onInternal");
    for (const [eventName, handler] of Object.entries(events)) {
      api.on(eventName, handler);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    nativeEvents("offInternal").off(eventName, listener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    nativeEvents("emitInternal").emit(eventName, ...args);
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
