import {
  type VimpServerBuiltinEvents,
  type Player as VimpServerPlayer,
  type Vehicle as VimpServerVehicle,
} from "@vimp-mp/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { ServerInternalEventName, type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type VIMPPlayer } from "../../../entities/vimp/player/VIMPPlayer";
import { RockMod } from "../../../RockMod";

export interface IVIMPServerVehicleEvents {
  playerEnterVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
  playerExitVehicle: (player: VimpServerPlayer, vehicle: VimpServerVehicle, seat: number) => void;
}

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

  public onInternal(events: Partial<IVIMPServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      if (eventName === ServerInternalEventName.PlayerDeath) {
        const listener = events[eventName];
        if (listener) this._playerDeathListeners.push(listener);
        continue;
      }
      // @ts-expect-error mixed VIMP built-in + rm:: keys typing
      vimp.on(eventName, events[eventName]);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    if (eventName === ServerInternalEventName.PlayerDeath) {
      const index = this._playerDeathListeners.findIndex((handler) => handler === listener);
      if (index !== -1) this._playerDeathListeners.splice(index, 1);
      return;
    }
    vimp.off(eventName, listener as (...args: unknown[]) => void);
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

  private _getRockModPlayer(player: unknown): VIMPPlayer {
    const playerId = (player as { id?: unknown } | null)?.id;

    if (typeof playerId !== "number") {
      throw new Error("VIMPEventsManager.onClient: event sender does not contain numeric player id");
    }

    return RockMod.instance.players.getByID(playerId) as VIMPPlayer;
  }
}
