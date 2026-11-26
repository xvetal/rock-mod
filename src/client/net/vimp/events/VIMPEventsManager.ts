/// <reference types="@vimp-mp/types/client" />
import { type IEventsManager } from "../../common/events/IEventsManager";
import { ClientInternalEventName, type IClientInternalEvents } from "../../common/events/types";
import { type IPlayer } from "@RockMod/client/entities";
import { type IClientToServerEvents, type IServerToClientEvents } from "@shared/net/common/events/types";

type Listener = (...args: unknown[]) => void;

/**
 * `IEventsManager` over the VIMP client API.
 *
 * VIMP delivers built-in, server and CEF events through one `vimp.on` registry
 * with `off` and a local `emit`, and network events carry every argument. So
 * each method maps directly onto `vimp.on`/`off`/`emit`/`emitServer`.
 * Each handler is isolated as on RAGE: an exception is logged and the other handlers still run.
 */
export class VIMPEventsManager implements IEventsManager {
  private readonly _sticky = new Map<string, unknown[]>();

  /** Isolated wrappers by event and original listener; `off` pops the latest one, as `vimp.off` does. */
  private readonly _wrapped = new Map<string, Map<Listener, Listener[]>>();

  // VIMP dispatches the handlers. Track SDK spawn subscriptions to decide when to replay.
  private readonly _playerSpawnListeners: Listener[] = [];

  public onRaw(events: Partial<IClientEvents>): void {
    this._onAll(events);
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    this._off(eventName as string, listener as Listener | undefined);
  }

  public onInternal(events: Partial<IClientInternalEvents>): void {
    this._onAll(events);
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    this._off(eventName, listener as Listener | undefined);
  }

  public emitInternal<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    vimp.emit(eventName, ...args);
  }

  /** Like `emitInternal`, and listeners subscribed later receive these arguments immediately. */
  public emitInternalSticky<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    this._sticky.set(eventName, args);
    vimp.emit(eventName, ...args);
  }

  public clearInternalSticky<K extends keyof IClientInternalEvents>(eventName: K): void {
    this._sticky.delete(eventName);
  }

  public emitPlayerSpawn(player: IPlayer): void {
    const event = ClientInternalEventName.PlayerSpawn;
    if (this._playerSpawnListeners.length === 0) {
      this.emitInternalSticky(event, player);
      return;
    }

    this.clearInternalSticky(event);
    this.emitInternal(event, player);
  }

  public onServer(events: Partial<IServerToClientEvents>): void {
    this._onAll(events);
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener?: IServerToClientEvents[K]): void {
    this._off(eventName, listener as unknown as Listener | undefined);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    vimp.emitServer(eventName, ...args);
  }

  public register(event: string, listener: Listener): void {
    if (event === ClientInternalEventName.PlayerSpawn) {
      this._onAll({ [event]: listener });
      return;
    }
    vimp.on(event, this._wrap(event, listener));
  }

  public unregister(event: string): void {
    this._off(event);
  }

  private _onAll(events: object): void {
    for (const [event, listener] of Object.entries(events) as [string, Listener | undefined][]) {
      if (!listener) continue;
      const wrapped = this._wrap(event, listener);
      vimp.on(event, wrapped);
      if (event === ClientInternalEventName.PlayerSpawn) {
        this._playerSpawnListeners.push(listener);
      }
      const sticky = this._sticky.get(event);
      if (sticky) wrapped(...sticky);
    }
  }

  private _off(event: string, listener?: Listener): void {
    const wrappers = this._wrapped.get(event);
    if (listener) {
      const stack = wrappers?.get(listener);
      vimp.off(event, stack?.pop() ?? listener);
      if (stack?.length === 0) wrappers?.delete(listener);
    } else {
      vimp.off(event);
      this._wrapped.delete(event);
    }
    if (event !== ClientInternalEventName.PlayerSpawn) return;

    if (!listener) {
      this._playerSpawnListeners.length = 0;
      return;
    }

    const index = this._playerSpawnListeners.lastIndexOf(listener);
    if (index !== -1) {
      this._playerSpawnListeners.splice(index, 1);
    }
  }

  private _wrap(event: string, listener: Listener): Listener {
    const wrapped: Listener = (...args) => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`[VIMPEventsManager] handler for "${event}" failed:`, error);
      }
    };
    let wrappers = this._wrapped.get(event);
    if (!wrappers) {
      wrappers = new Map();
      this._wrapped.set(event, wrappers);
    }
    const stack = wrappers.get(listener);
    if (stack) stack.push(wrapped);
    else wrappers.set(listener, [wrapped]);
    return wrapped;
  }
}
