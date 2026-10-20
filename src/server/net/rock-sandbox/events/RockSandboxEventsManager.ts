import { type RockSandboxServer } from "@rock-sandbox/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IPlayer } from "../../../entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

type NativeEvents = Pick<RockSandboxServer, "on" | "off" | "emit">;

function nativeEvents(member: string): NativeEvents {
  const candidate: unknown = Reflect.get(globalThis, "rockSandbox");
  const api = candidate as Partial<NativeEvents> | null | undefined;
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
  return api as NativeEvents;
}

export class RockSandboxEventsManager implements IEventsManager {
  public onInternal(events: Partial<IServerInternalEvents>): void {
    const api = nativeEvents("onInternal");
    for (const [eventName, handler] of Object.entries(events)) {
      // The public event map checks each tuple; forward heterogeneous handlers
      // without wrapping them so native off() can match their original identity.
      api.on<string, never[]>(eventName, handler);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    nativeEvents("offInternal").off<string, never[]>(eventName, listener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    nativeEvents("emitInternal").emit<string>(eventName, ...args);
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
