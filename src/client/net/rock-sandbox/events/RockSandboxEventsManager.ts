import { type IEventsManager } from "../../common/events/IEventsManager";
import { type IServerToClientEvents, type IClientToServerEvents } from "../../../../shared/net/common/events/types";
import { type IClientInternalEvents } from "../../common/events/types";
import {
  type RockSandboxClient,
  type RockSandboxPlayerLifecycle,
  type RockSandboxEntityLifecycle,
} from "@rock-sandbox/types/client";
import { wrapVehicle } from "../../../entities/rock-sandbox/vehicle/RockSandboxVehicle";
import { wrapPlayer } from "../../../entities/rock-sandbox/player/RockSandboxPlayer";
import { wrapPed } from "../../../entities/rock-sandbox/ped/RockSandboxPed";
import { wrapObject } from "../../../entities/rock-sandbox/object/RockSandboxObject";
import { getRockSandbox } from "../../../internal/getRockSandbox";

const bridgedHosts = new WeakSet<RockSandboxClient>();
const lifecycleNames = new Map<string, RockSandboxPlayerLifecycle["type"]>([
  ["rm::playerConnected", "connected"],
  ["rm::playerDisconnected", "disconnected"],
  ["rm::playerReady", "ready"],
]);
const streamNames = new Map<string, RockSandboxEntityLifecycle["type"]>([
  ["rm::entityStreamIn", "streamIn"],
  ["rm::entityStreamOut", "streamOut"],
]);
function wrapEntity(
  entity: RockSandboxEntityLifecycle["entity"],
): ReturnType<typeof wrapPlayer | typeof wrapVehicle | typeof wrapPed | typeof wrapObject> {
  switch (entity.entityType) {
    case "player":
      return wrapPlayer(entity);
    case "vehicle":
      return wrapVehicle(entity);
    case "ped":
      return wrapPed(entity);
    case "object":
      return wrapObject(entity);
  }
}
type Handler = (...args: never[]) => void;
type Subscription = { handler: Handler; dispose: () => void };
const lifecycleSubscriptions = new WeakMap<RockSandboxClient, Map<string, Subscription[]>>();

export class RockSandboxEventsManager implements IEventsManager {
  private _subscribe(api: RockSandboxClient, event: string, handler: Handler): void {
    const type = lifecycleNames.get(event);
    const stream = streamNames.get(event);
    if (!type && !stream) {
      api.on<string, never[]>(event, handler);
      return;
    }
    const dispose = stream
      ? api.entities.observeLifecycle((value) => {
          if (value.type === stream) Reflect.apply(handler, undefined, [wrapEntity(value.entity)]);
        })
      : api.players.observeLifecycle((value) => {
          if (value.type === type) Reflect.apply(handler, undefined, [wrapPlayer(value.player)]);
        });
    api.on<string, never[]>(event, handler);
    let subscriptions = lifecycleSubscriptions.get(api);
    if (!subscriptions) lifecycleSubscriptions.set(api, (subscriptions = new Map()));
    subscriptions.set(event, [...(subscriptions.get(event) ?? []), { handler, dispose }]);
  }

  private _unsubscribe(api: RockSandboxClient, event: string, handler?: Handler): void {
    const subscriptions = lifecycleSubscriptions.get(api);
    const entries = subscriptions?.get(event);
    if (!entries) return;
    if (handler === undefined) {
      for (const entry of entries) entry.dispose();
      subscriptions?.delete(event);
    } else {
      const index = entries.map((entry) => entry.handler).lastIndexOf(handler);
      if (index >= 0) entries.splice(index, 1)[0]?.dispose();
      if (!entries.length) subscriptions?.delete(event);
    }
  }

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
    for (const [name, handler] of Object.entries(events)) this._subscribe(api, name, handler);
  }

  public offInternal<K extends keyof IClientInternalEvents>(eventName: K, listener?: IClientInternalEvents[K]): void {
    const api = getRockSandbox();
    this._unsubscribe(api, eventName, listener);
    api.off<string, never[]>(eventName, listener);
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
    this._subscribe(api, event, listener);
    api.onServer<string, unknown[]>(event, listener);
  }

  public unregister(event: string): void {
    const api = getRockSandbox();
    this._unsubscribe(api, event);
    api.off<string, unknown[]>(event);
    api.offServer<string, unknown[]>(event);
  }
}
