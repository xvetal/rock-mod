import {
  type VimpServerBuiltinEvents,
  type Player as VimpServerPlayer,
  type Vehicle as VimpServerVehicle,
} from "@vimp-mp/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { ServerInternalEventName, type IServerInternalEvents, type PlayerDamageCause } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type VIMPPlayer } from "../../../entities/vimp/player/VIMPPlayer";
import { RockMod } from "../../../RockMod";
import { createVIMPDamageRequest } from "./VIMPDamageRequest";

export interface IVIMPServerVehicleEvents {
  playerEnterVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
  playerExitVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
}

export type VIMPPlayerDeathCause =
  | "weapon"
  | "melee"
  | "explosion"
  | "fall"
  | "fire"
  | "drown"
  | "vehicle"
  | "npc"
  | "other"
  | "script";

export interface IVIMPPlayerDeath {
  readonly killer: VimpServerPlayer | null;
  readonly weapon: number | null;
  readonly cause: VIMPPlayerDeathCause;
}

/** Argument of the VIMP `playerDamage` event; valid only while handlers run. */
export interface IVIMPPlayerDamage {
  readonly attacker: VimpServerPlayer | null;
  readonly weapon: number | null;
  readonly cause: PlayerDamageCause;
  readonly bone: number | null;
  readonly distance: number | null;
  readonly hits: number;
  readonly health: number;
  readonly armour: number;
  readonly lethal: boolean;
  readonly estimated: boolean;
  readonly cancelled: boolean;
  cancel(): void;
  setDamage(health: number, armour?: number): void;
}

export interface IVIMPPlayerWeaponShot {
  readonly weapon: number;
  readonly clip: number | null;
  readonly accepted: boolean;
  readonly rejection: string | null;
}

// VIMP combat API, not in the published @vimp-mp/types yet; servers without it never emit it.
export interface IVIMPServerCombatEvents {
  playerDeath: (player: VimpServerPlayer, death: IVIMPPlayerDeath) => void;
  playerWeaponShot: (player: VimpServerPlayer, shot: IVIMPPlayerWeaponShot) => void;
  playerDamage: (victim: VimpServerPlayer, damage: IVIMPPlayerDamage) => void;
}

type AnyListener = (...args: unknown[]) => void;

const DAMAGE_REQUEST = ServerInternalEventName.PlayerDamageRequest;

export interface IVIMPServerInternalEvents
  extends IServerInternalEvents,
    VimpServerBuiltinEvents,
    IVIMPServerVehicleEvents {}

type PlayerDeathListener = IServerInternalEvents[ServerInternalEventName.PlayerDeath];

export class VIMPEventsManager implements IEventsManager {
  /** `vimp.on` callbacks registered by `onClient`, keyed by the Rock-Mod listener, so `offClient` can remove them. */
  private readonly _clientHandlers = new Map<string, Map<unknown, (player: unknown, ...args: unknown[]) => void>>();

  // Keep the trusted death notification off VIMP's shared client and server event bus.
  private readonly _playerDeathListeners: PlayerDeathListener[] = [];

  /** Listeners of `rm::playerDamageRequest`; VIMP delays damage while it has a `playerDamage` handler. */
  private readonly _damageRequestListeners = new Map<AnyListener, number>();

  private _damageBridgeAttached = false;

  public onInternal(events: Partial<IVIMPServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      if (eventName === ServerInternalEventName.PlayerDeath) {
        const listener = events[eventName];
        if (listener) this._playerDeathListeners.push(listener);
        continue;
      }
      // @ts-expect-error mixed VIMP built-in + rm:: keys typing
      const listener = events[eventName] as AnyListener;
      vimp.on(eventName, listener);
      if (eventName === DAMAGE_REQUEST) this._addDamageRequestListener(listener);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    if (eventName === ServerInternalEventName.PlayerDeath) {
      const index = this._playerDeathListeners.findIndex((handler) => handler === listener);
      if (index !== -1) this._playerDeathListeners.splice(index, 1);
      return;
    }
    vimp.off(eventName, listener as AnyListener);
    if (eventName === DAMAGE_REQUEST) this._removeDamageRequestListener(listener as AnyListener);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    if (eventName === ServerInternalEventName.PlayerDeath) {
      const deathArgs = args as Parameters<PlayerDeathListener>;
      for (const listener of this._playerDeathListeners) {
        try {
          listener(...deathArgs);
        } catch (error) {
          console.error(`[rock-mod] Handler error for "${eventName}":`, error);
        }
      }
      return;
    }
    vimp.emit(eventName, ...args);
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

  private _addDamageRequestListener(listener: AnyListener): void {
    this._damageRequestListeners.set(listener, (this._damageRequestListeners.get(listener) ?? 0) + 1);
    if (this._damageBridgeAttached) return;
    vimp.on("playerDamage", this._bridgeDamageRequest as AnyListener);
    this._damageBridgeAttached = true;
  }

  private _removeDamageRequestListener(listener: AnyListener): void {
    const count = this._damageRequestListeners.get(listener);
    if (count === undefined) return;
    if (count > 1) {
      this._damageRequestListeners.set(listener, count - 1);
      return;
    }
    this._damageRequestListeners.delete(listener);
    if (this._damageRequestListeners.size > 0 || !this._damageBridgeAttached) return;
    vimp.off("playerDamage", this._bridgeDamageRequest as AnyListener);
    this._damageBridgeAttached = false;
  }

  private readonly _bridgeDamageRequest = (victim: VimpServerPlayer, damage: IVIMPPlayerDamage): void => {
    const players = RockMod.instance.players;
    const player = players.findByID(victim.id);
    if (!player) return;
    const attacker = damage.attacker ? players.findByID(damage.attacker.id) : null;
    const { request, seal } = createVIMPDamageRequest(damage, attacker);
    try {
      vimp.emit(DAMAGE_REQUEST, player, request);
    } catch (error) {
      console.error("[rock-mod] rm::playerDamageRequest handler failed", error);
    } finally {
      seal();
    }
  };

  private _getRockModPlayer(player: unknown): VIMPPlayer {
    const playerId = (player as { id?: unknown } | null)?.id;

    if (typeof playerId !== "number") {
      throw new Error("VIMPEventsManager.onClient: event sender does not contain numeric player id");
    }

    return RockMod.instance.players.getByID(playerId) as VIMPPlayer;
  }
}
