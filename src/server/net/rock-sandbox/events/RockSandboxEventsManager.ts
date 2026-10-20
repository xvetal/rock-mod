import { type RockSandboxServer } from "@rock-sandbox/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { ServerInternalEventName, type IServerInternalEvents } from "../../common/events/types";
import { type IPlayer } from "../../../entities";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapPlayer } from "../../../entities/rock-sandbox/player/RockSandboxPlayer";

const bridgedHosts = new WeakSet<RockSandboxServer>();

function bridgePlayers(api: RockSandboxServer): void {
  if (bridgedHosts.has(api)) return;
  api.on("playerConnected", (player) => api.emit(ServerInternalEventName.PlayerConnected, wrapPlayer(player)));
  api.on("playerDisconnected", (player) => api.emit(ServerInternalEventName.PlayerDisconnected, wrapPlayer(player)));
  api.on("playerDeath", (player, reason, killer) =>
    api.emit(
      ServerInternalEventName.PlayerDeath,
      wrapPlayer(player),
      reason,
      killer === null ? null : wrapPlayer(killer),
    ),
  );
  bridgedHosts.add(api);
}

export class RockSandboxEventsManager implements IEventsManager {
  public onInternal(events: Partial<IServerInternalEvents>): void {
    const api = getRockSandbox();
    if (
      ServerInternalEventName.PlayerConnected in events ||
      ServerInternalEventName.PlayerDisconnected in events ||
      ServerInternalEventName.PlayerDeath in events
    ) {
      bridgePlayers(api);
    }
    for (const [eventName, handler] of Object.entries(events)) {
      // The public event map checks each tuple; forward heterogeneous handlers
      // without wrapping them so native off() can match their original identity.
      api.on<string, never[]>(eventName, handler);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    getRockSandbox().off<string, never[]>(eventName, listener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    getRockSandbox().emit<string>(eventName, ...args);
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
