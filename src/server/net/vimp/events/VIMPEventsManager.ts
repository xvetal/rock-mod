import {
  type VimpServerBuiltinEvents,
  type PlayerDamage,
  type PlayerDamageApplied,
  type Player as VimpServerPlayer,
  type Vehicle as VimpServerVehicle,
} from "@vimp-mp/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { ServerInternalEventName, type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type VIMPPlayer } from "../../../entities/vimp/player/VIMPPlayer";
import { RockMod } from "../../../RockMod";
import { createVIMPDamageRequest } from "./VIMPDamageRequest";

export interface IVIMPServerVehicleEvents {
  playerEnterVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
  playerExitVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
}

type AnyListener = (...args: unknown[]) => void;

const DAMAGE_REQUEST = ServerInternalEventName.PlayerDamageRequest;
const DAMAGE = ServerInternalEventName.PlayerDamage;

export interface IVIMPServerInternalEvents
  extends IServerInternalEvents,
    VimpServerBuiltinEvents,
    IVIMPServerVehicleEvents {}

export class VIMPEventsManager implements IEventsManager {
  /** `vimp.on` callbacks registered by `onClient`, keyed by the Rock-Mod listener, so `offClient` can remove them. */
  private readonly _clientHandlers = new Map<string, Map<unknown, (player: unknown, ...args: unknown[]) => void>>();

  // The VIMP event bus also receives client events. Keep rm:: listeners on the server.
  private readonly _internalListeners = new Map<string, AnyListener[]>();

  public onInternal(events: Partial<IVIMPServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      const listener = events[eventName as keyof IVIMPServerInternalEvents] as AnyListener | undefined;
      if (!listener) continue;
      if (!eventName.startsWith("rm::")) {
        vimp.on(eventName, listener);
        continue;
      }
      const listeners = this._internalListeners.get(eventName) ?? [];
      listeners.push(listener);
      this._internalListeners.set(eventName, listeners);
      if (listeners.length === 1) {
        if (eventName === DAMAGE_REQUEST) vimp.on("playerDamage", this._bridgeDamageRequest);
        if (eventName === DAMAGE && vimp.supportsPlayerDamageApplied) {
          vimp.on("playerDamageApplied", this._bridgeDamageApplied);
        }
      }
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    const listeners = this._internalListeners.get(eventName);
    const index = listeners?.indexOf(listener as AnyListener) ?? -1;
    if (!listeners || index < 0) return;
    listeners.splice(index, 1);
    if (listeners.length) return;
    this._internalListeners.delete(eventName);
    if (eventName === DAMAGE_REQUEST) vimp.off("playerDamage", this._bridgeDamageRequest);
    if (eventName === DAMAGE) vimp.off("playerDamageApplied", this._bridgeDamageApplied);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    const listeners = this._internalListeners.get(eventName);
    if (!listeners) return;
    for (const listener of [...listeners]) {
      try {
        listener(...args);
      } catch (error) {
        console.error(`[rock-mod] handler error for "${eventName}":`, error);
      }
    }
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    for (const [eventName, listener] of Object.entries(events)) {
      if (!listener) continue;
      const handler = listener as (player: VIMPPlayer, ...args: unknown[]) => void;
      // Only the sender changes: VIMP passes its native player, handlers expect the Rock-Mod one.
      const callback = (player: unknown, ...args: unknown[]): void => handler(this._getRockModPlayer(player), ...args);
      let handlers = this._clientHandlers.get(eventName);
      if (!handlers) {
        handlers = new Map();
        this._clientHandlers.set(eventName, handlers);
      }
      handlers.set(listener, callback);
      vimp.on(eventName, callback);
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    const handlers = this._clientHandlers.get(eventName);
    const callback = handlers?.get(listener);
    if (!handlers || !callback) return;
    handlers.delete(listener);
    vimp.off(eventName, callback);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: VIMPPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    const vimpPlayer = vimp.players.getById(player.id);

    if (!vimpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    vimpPlayer.emit(eventName, ...args);
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    vimp.emitAllClients(eventName, ...args);
  }

  private readonly _bridgeDamageRequest = (victim: VimpServerPlayer, damage: PlayerDamage): void => {
    if (typeof damage?.cancel !== "function" || typeof damage.setDamage !== "function") return;
    const players = RockMod.instance.players;
    const player = players.findByID(victim.id);
    if (!player) return;
    const attacker = damage.attacker ? players.findByID(damage.attacker.id) : null;
    const { request, seal } = createVIMPDamageRequest(damage, attacker);
    try {
      this.emitInternal(DAMAGE_REQUEST, player, request);
    } finally {
      seal();
    }
  };

  private readonly _bridgeDamageApplied = (victim: VimpServerPlayer, damage: PlayerDamageApplied): void => {
    const players = RockMod.instance.players;
    const player = players.findByID(victim.id);
    if (!player) return;
    const attacker = damage.attacker ? players.findByID(damage.attacker.id) : null;
    this.emitInternal(DAMAGE, player, damage.health, damage.armour, attacker);
  };

  private _getRockModPlayer(player: unknown): VIMPPlayer {
    const playerId = (player as { id?: unknown } | null)?.id;

    if (typeof playerId !== "number") {
      throw new Error("VIMPEventsManager.onClient: event sender does not contain numeric player id");
    }

    return RockMod.instance.players.getByID(playerId) as VIMPPlayer;
  }
}
