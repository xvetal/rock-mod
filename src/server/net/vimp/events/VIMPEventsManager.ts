import {
  type VimpServerBuiltinEvents,
  type Player as VimpServerPlayer,
  type Vehicle as VimpServerVehicle,
} from "@vimp-mp/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerInternalEvents } from "../../common/events/types";
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

export class VIMPEventsManager implements IEventsManager {
  public onInternal(events: Partial<IVIMPServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error mixed VIMP built-in + rm:: keys typing
      vimp.on(eventName, events[eventName]);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    vimp.off(eventName, listener as (...args: unknown[]) => void);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    vimp.emit(eventName, ...args);
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error generic event typing
      const handler = events[eventName] as (player: unknown, ...args: unknown[]) => void;
      // Клиент шлёт variadic args упакованными в массив через
      // `vimp.emitServer(name, args)` (см. client VIMPEventsManager.emitServer).
      // Разворачиваем массив обратно в позиционные аргументы. Скалярные/объектные
      // payload'ы прокидываем как единственный аргумент.
      vimp.on(eventName, (player: unknown, data: unknown) => {
        const rockModPlayer = this._getRockModPlayer(player);
        const args = Array.isArray(data) ? data : [data];
        handler(rockModPlayer, ...args);
      });
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    vimp.off(eventName, listener as (...args: unknown[]) => void);
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

    vimpPlayer.emit(eventName, args);
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    vimp.emitAllClients(eventName, args);
  }

  private _getRockModPlayer(player: unknown): VIMPPlayer {
    const playerId = (player as { id?: unknown } | null)?.id;

    if (typeof playerId !== "number") {
      throw new Error("VIMPEventsManager.onClient: event sender does not contain numeric player id");
    }

    return RockMod.instance.players.getByID(playerId) as VIMPPlayer;
  }
}
