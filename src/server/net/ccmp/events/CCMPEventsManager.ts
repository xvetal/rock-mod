import { type CcmpServerBuiltinEvents } from "@classic-mp/types/server";
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "../../../../shared";
import { type CCMPPlayer } from "../../../entities/ccmp/player/CCMPPlayer";

export interface ICCMPServerInternalEvents extends IServerInternalEvents, CcmpServerBuiltinEvents {}

export class CCMPEventsManager implements IEventsManager {
  public onInternal(events: Partial<ICCMPServerInternalEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error mixed CCMP built-in + rm:: keys typing
      ccmp.on(eventName, events[eventName]);
    }
  }

  public offInternal<K extends keyof IServerInternalEvents>(eventName: K, listener: IServerInternalEvents[K]): void {
    ccmp.off(eventName, listener as (...args: unknown[]) => void);
  }

  public emitInternal<K extends keyof IServerInternalEvents>(
    eventName: K,
    ...args: Parameters<IServerInternalEvents[K]>
  ): void {
    ccmp.emit(eventName, ...args);
  }

  public onClient(events: Partial<IClientToServerEvents>): void {
    for (const eventName of Object.keys(events)) {
      // @ts-expect-error generic event typing
      const handler = events[eventName] as (player: unknown, ...args: unknown[]) => void;
      // Клиент шлёт variadic args упакованными в массив через
      // `ccmp.emitServer(name, args)` (см. client CCMPEventsManager.emitServer).
      // Разворачиваем массив обратно в позиционные аргументы. Скалярные/объектные
      // payload'ы прокидываем как единственный аргумент.
      ccmp.on(eventName, (player: unknown, data: unknown) => {
        const args = Array.isArray(data) ? data : [data];
        handler(player, ...args);
      });
    }
  }

  public offClient<K extends keyof IClientToServerEvents>(eventName: K, listener: IClientToServerEvents[K]): void {
    ccmp.off(eventName, listener as (...args: unknown[]) => void);
  }

  public emitClient<K extends keyof IServerToClientEvents>(
    player: CCMPPlayer,
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    const ccmpPlayer = ccmp.players.getById(player.id);

    if (!ccmpPlayer) {
      throw new Error(`Player with id ${player.id} not found`);
    }

    ccmpPlayer.emit(eventName, args);
  }

  public emitAllClients<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    ccmp.emitAllClients(eventName, args);
  }
}
