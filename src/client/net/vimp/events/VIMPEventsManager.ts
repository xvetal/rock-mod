/// <reference types="@vimp-mp/types/client" />
import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IClientInternalEvents } from "../../common/events/types";
import { type IClientToServerEvents, type IServerToClientEvents } from "@shared/net/common/events/types";

type Listener = (...args: unknown[]) => void;

/**
 * `IEventsManager` over the VIMP client API.
 *
 * VIMP delivers built-in, server and CEF events through one `vimp.on` registry
 * with `off` and a local `emit`, and network events carry every argument. So
 * each method maps directly onto `vimp.on`/`off`/`emit`/`emitServer`.
 * Handler exceptions propagate to the native runtime or to the `emitInternal` caller.
 */
export class VIMPEventsManager implements IEventsManager {
  private readonly _sticky = new Map<string, unknown[]>();

  public onRaw(events: Partial<IClientEvents>): void {
    this._onAll(events);
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    vimp.off(eventName as string, listener as Listener | undefined);
  }

  public onInternal(events: Partial<IClientInternalEvents>): void {
    this._onAll(events);
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    vimp.off(eventName, listener as Listener | undefined);
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

  public onServer(events: Partial<IServerToClientEvents>): void {
    this._onAll(events);
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener?: IServerToClientEvents[K]): void {
    vimp.off(eventName, listener as unknown as Listener | undefined);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    vimp.emitServer(eventName, ...args);
  }

  public register(event: string, listener: Listener): void {
    vimp.on(event, listener);
  }

  public unregister(event: string): void {
    vimp.off(event);
  }

  private _onAll(events: object): void {
    for (const [event, listener] of Object.entries(events) as [string, Listener | undefined][]) {
      if (!listener) continue;
      vimp.on(event, listener);
      const sticky = this._sticky.get(event);
      if (sticky) listener(...sticky);
    }
  }
}
