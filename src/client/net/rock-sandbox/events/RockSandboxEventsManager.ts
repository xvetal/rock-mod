import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerToClientEvents, type IClientToServerEvents } from "../../../../shared/net/common/events/types";
import { type IClientInternalEvents } from "../../common/events/types";
import { type RockSandboxClient } from "@rock-sandbox/types/client";
import { getRockSandbox } from "../../../internal/getRockSandbox";

const bridgedHosts = new WeakSet<RockSandboxClient>();

export class RockSandboxEventsManager implements IEventsManager {
  public onRaw(events: Partial<IClientEvents>): void {
    const api = getRockSandbox();
    for (const [name, handler] of Object.entries(events)) api.on<string, never[]>(name, handler);
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    getRockSandbox().off<string, never[]>(String(eventName), listener);
  }

  public onInternal(events: Partial<IClientInternalEvents>): void {
    const api = getRockSandbox();
    if ("rm::render" in events && !bridgedHosts.has(api)) {
      api.on("render", () => api.emit<string>("rm::render"));
      bridgedHosts.add(api);
    }
    for (const [name, handler] of Object.entries(events)) api.on<string, never[]>(name, handler);
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    getRockSandbox().off<string, never[]>(eventName, listener);
  }

  public emitInternal<K extends keyof IClientInternalEvents>(
    eventName: K,
    ...args: Parameters<IClientInternalEvents[K]>
  ): void {
    getRockSandbox().emit<string>(eventName, ...args);
  }

  public onServer(events: Partial<IServerToClientEvents>): void {
    const api = getRockSandbox();
    for (const [name, handler] of Object.entries(events)) api.onServer<string, never[]>(name, handler);
  }

  public offServer<K extends keyof IServerToClientEvents>(eventName: K, listener?: IServerToClientEvents[K]): void {
    getRockSandbox().offServer<string, never[]>(eventName, listener);
  }

  public emitServer<K extends keyof IClientToServerEvents>(
    eventName: K,
    ...args: Parameters<IClientToServerEvents[K]>
  ): void {
    getRockSandbox().emitServer<string>(eventName, ...args);
  }

  public register(event: string, listener: (...args: unknown[]) => void): void {
    const api = getRockSandbox();
    api.on<string, unknown[]>(event, listener);
    api.onServer<string, unknown[]>(event, listener);
  }

  public unregister(event: string): void {
    const api = getRockSandbox();
    api.off<string, unknown[]>(event);
    api.offServer<string, unknown[]>(event);
  }
}
