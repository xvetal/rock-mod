import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerToClientEvents, type IClientToServerEvents } from "../../../../shared/net/common/events/types";
import { type IClientInternalEvents } from "../../common/events/types";
import { type RockSandboxClient } from "@rock-sandbox/types/client";
import { wrapVehicle } from "../../../entities/rock-sandbox/vehicle/RockSandboxVehicle";
import { getRockSandbox } from "../../../internal/getRockSandbox";

const bridgedHosts = new WeakSet<RockSandboxClient>();

export class RockSandboxEventsManager implements IEventsManager {
  private _installBridges(api: RockSandboxClient, names: string[]): void {
    if (
      names.some(
        (name) =>
          name === "rm::render" ||
          name === "rm::browserDomReady" ||
          name === "rm::playerWeaponShot" ||
          name === "rm::playerEnterVehicle" ||
          name === "rm::playerLeaveVehicle",
      ) &&
      !bridgedHosts.has(api)
    ) {
      api.on("render", () => api.emit<string>("rm::render"));
      api.on("browserDomReady", () => api.emit<string>("rm::browserDomReady"));
      api.on("playerWeaponShot", () => api.emit<string>("rm::playerWeaponShot"));
      api.on("playerEnterVehicle", (vehicle, seat) =>
        api.emit<string>("rm::playerEnterVehicle", wrapVehicle(vehicle), seat - 1),
      );
      api.on("playerExitVehicle", (vehicle, seat) =>
        api.emit<string>("rm::playerLeaveVehicle", wrapVehicle(vehicle), seat - 1),
      );
      bridgedHosts.add(api);
    }
  }

  public onRaw(events: Partial<IClientEvents>): void {
    const api = getRockSandbox();
    for (const [name, handler] of Object.entries(events)) api.on<string, never[]>(name, handler);
  }

  public offRaw<K extends keyof IClientEvents>(eventName: K, listener?: IClientEvents[K]): void {
    getRockSandbox().off<string, never[]>(String(eventName), listener);
  }

  public onInternal(events: Partial<IClientInternalEvents>): void {
    const api = getRockSandbox();
    this._installBridges(api, Object.keys(events));
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
    this._installBridges(api, [event]);
    api.on<string, unknown[]>(event, listener);
    api.onServer<string, unknown[]>(event, listener);
  }

  public unregister(event: string): void {
    const api = getRockSandbox();
    api.off<string, unknown[]>(event);
    api.offServer<string, unknown[]>(event);
  }
}
