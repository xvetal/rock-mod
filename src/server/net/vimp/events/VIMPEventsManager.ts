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
import { createVIMPDamageRequest, type IVIMPDamageAnswer } from "./VIMPDamageRequest";

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
const DAMAGE = ServerInternalEventName.PlayerDamage;

/** rock-mod events fed by the VIMP `playerDamage` bridge. */
const DAMAGE_BRIDGE_EVENTS: ReadonlySet<string> = new Set([DAMAGE_REQUEST, DAMAGE]);

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

  /**
   * Listeners of the events fed by the damage bridge, by event. VIMP queues damage for the scripts'
   * answer while it has a `playerDamage` handler, so the bridge is attached only while one exists.
   */
  private readonly _damageListeners = new Map<string, Map<AnyListener, number>>();

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
      if (DAMAGE_BRIDGE_EVENTS.has(eventName)) this._addDamageListener(eventName, listener);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    if (eventName === ServerInternalEventName.PlayerDeath) {
      const index = this._playerDeathListeners.findIndex((handler) => handler === listener);
      if (index !== -1) this._playerDeathListeners.splice(index, 1);
      return;
    }
    vimp.off(eventName, listener as AnyListener);
    if (DAMAGE_BRIDGE_EVENTS.has(eventName)) this._removeDamageListener(eventName, listener as AnyListener);
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

  private _addDamageListener(eventName: string, listener: AnyListener): void {
    let listeners = this._damageListeners.get(eventName);
    if (!listeners) {
      listeners = new Map();
      this._damageListeners.set(eventName, listeners);
    }
    listeners.set(listener, (listeners.get(listener) ?? 0) + 1);
    if (this._damageBridgeAttached) return;
    vimp.on("playerDamage", this._bridgeDamage as AnyListener);
    this._damageBridgeAttached = true;
  }

  private _removeDamageListener(eventName: string, listener: AnyListener): void {
    const listeners = this._damageListeners.get(eventName);
    const count = listeners?.get(listener);
    if (!listeners || count === undefined) return;
    if (count > 1) {
      listeners.set(listener, count - 1);
      return;
    }
    listeners.delete(listener);
    if (this._hasDamageListeners(DAMAGE_REQUEST) || this._hasDamageListeners(DAMAGE)) return;
    if (!this._damageBridgeAttached) return;
    vimp.off("playerDamage", this._bridgeDamage as AnyListener);
    this._damageBridgeAttached = false;
  }

  private _hasDamageListeners(eventName: string): boolean {
    return (this._damageListeners.get(eventName)?.size ?? 0) > 0;
  }

  private readonly _bridgeDamage = (victim: VimpServerPlayer, damage: IVIMPPlayerDamage): void => {
    const players = RockMod.instance.players;
    const player = players.findByID(victim.id);
    if (!player) return;
    const attacker = damage.attacker ? players.findByID(damage.attacker.id) : null;
    const { request, seal } = createVIMPDamageRequest(damage, attacker, () => victim.health);
    let answer: IVIMPDamageAnswer;
    try {
      // vimp.emit catches and logs every handler's exception itself.
      if (this._hasDamageListeners(DAMAGE_REQUEST)) vimp.emit(DAMAGE_REQUEST, player, request);
    } finally {
      answer = seal();
    }
    if (answer.cancelled || (answer.health <= 0 && answer.armour <= 0) || !this._hasDamageListeners(DAMAGE)) return;

    // VIMP applies the answer once this handler has returned, so report it on the next turn.
    const { health, armour } = answer;
    setImmediate(() => {
      if (!player.isExists) return;
      const source = attacker && attacker.isExists ? attacker : null;
      vimp.emit(DAMAGE, player, health, armour, source);
    });
  };

  private _getRockModPlayer(player: unknown): VIMPPlayer {
    const playerId = (player as { id?: unknown } | null)?.id;

    if (typeof playerId !== "number") {
      throw new Error("VIMPEventsManager.onClient: event sender does not contain numeric player id");
    }

    return RockMod.instance.players.getByID(playerId) as VIMPPlayer;
  }
}
