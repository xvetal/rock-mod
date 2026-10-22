import { type RockSandboxServer } from "@rock-sandbox/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import {
  ServerInternalEventName,
  type IServerInternalEvents,
  type IPlayerQuitSnapshot,
} from "../../common/events/types";
import { type IPlayer } from "../../../entities";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { wrapPlayer } from "../../../entities/rock-sandbox/player/RockSandboxPlayer";

import { wrapColshape } from "../../../entities/rock-sandbox/colshape/RockSandboxCylinderColshape";

const bridgedHosts = new WeakSet<RockSandboxServer>();

function bridgePlayers(api: RockSandboxServer): void {
  if (bridgedHosts.has(api)) return;
  api.on("playerConnected", (player) => api.emit(ServerInternalEventName.PlayerConnected, wrapPlayer(player)));
  api.on("playerDisconnected", (player, context) => {
    const wrapped = wrapPlayer(player);
    const { x, y, z } = context.snapshot.position;
    const snapshot: IPlayerQuitSnapshot = Object.freeze({
      ...context.snapshot,
      position: Object.freeze({ x, y: -z, z: y }),
    });
    api.emit(ServerInternalEventName.PlayerQuit, wrapped, context.exitType, context.reason, snapshot);
    api.emit(ServerInternalEventName.PlayerDisconnected, wrapped);
  });
  api.on("playerDeath", (player, reason, killer) =>
    api.emit(
      ServerInternalEventName.PlayerDeath,
      wrapPlayer(player),
      reason,
      killer === null ? null : wrapPlayer(killer),
    ),
  );
  api.on("playerEnteredColshape", (player, colshape) =>
    api.emit(ServerInternalEventName.PlayerEnteredColshape, wrapPlayer(player), wrapColshape(colshape)),
  );
  api.on("playerLeftColshape", (player, colshape) =>
    api.emit(ServerInternalEventName.PlayerLeftColshape, wrapPlayer(player), wrapColshape(colshape)),
  );
  bridgedHosts.add(api);
}

const clientBridgedHosts = new WeakSet<RockSandboxServer>();

function bridgeClients(api: RockSandboxServer): void {
  if (clientBridgedHosts.has(api)) return;
  api.on("clientEvent", (player, eventName, args) =>
    api.emit<string>(`rm::client:${eventName}`, wrapPlayer(player), ...args),
  );
  clientBridgedHosts.add(api);
}

export class RockSandboxEventsManager implements IEventsManager {
  public onInternal(events: Partial<IServerInternalEvents>): void {
    const api = getRockSandbox();
    if (
      ServerInternalEventName.PlayerConnected in events ||
      ServerInternalEventName.PlayerDisconnected in events ||
      ServerInternalEventName.PlayerQuit in events ||
      ServerInternalEventName.PlayerDeath in events ||
      ServerInternalEventName.PlayerEnteredColshape in events ||
      ServerInternalEventName.PlayerLeftColshape in events
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

  public onClient(events: Partial<IClientToServerEvents>): void {
    const api = getRockSandbox();
    bridgeClients(api);
    for (const [eventName, handler] of Object.entries(events)) {
      api.on<string, never[]>(`rm::client:${eventName}`, handler);
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    getRockSandbox().off<string, never[]>(`rm::client:${String(eventName)}`, listener);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: IPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    player.emitEvent(eventName, ...args);
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    getRockSandbox().emitAllClients<string>(eventName, ...args);
  }
}
