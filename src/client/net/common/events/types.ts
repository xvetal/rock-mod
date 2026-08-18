import { type IBaseObject, type IEntity, type IPlayer, type IVehicle } from "@RockMod/client/entities";
import { type IVector3D } from "@shared/common/utils";

export enum ClientInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
  PlayerReady = "rm::playerReady",
  BrowserDomReady = "rm::browserDomReady",
  EntityStreamIn = "rm::entityStreamIn",
  EntityStreamOut = "rm::entityStreamOut",
  PlayerEnterVehicle = "rm::playerEnterVehicle",
  PlayerLeaveVehicle = "rm::playerLeaveVehicle",
  PlayerDeath = "rm::playerDeath",
  PlayerSpawn = "rm::playerSpawn",
  PlayerWeaponShot = "rm::playerWeaponShot",
  OutgoingDamage = "rm::outgoingDamage",
  IncomingDamage = "rm::incomingDamage",
  Render = "rm::render",
  Click = "rm::click",
  SyncedMetaChange = "rm::syncedMetaChange",
}

export interface IClickOptions {
  absoluteX: number;
  absoluteY: number;
  upOrDown: "up" | "down";
  leftOrRight: "left" | "right";
  relativeX: number | null;
  relativeY: number | null;
  worldPosition: IVector3D | null;
  hitEntity: number | null;
}

export interface IOutgoingDamageEvent {
  source: IEntity | null;
  target: IEntity | null;
  targetPlayer: IPlayer | null;
  weaponHash: number;
  boneIndex: number;
  nativeDamage: number;
  cancel(): void;
}

export interface IIncomingDamageEvent {
  source: IEntity | null;
  sourcePlayer: IPlayer | null;
  target: IEntity | null;
  weaponHash: number;
  boneIndex: number;
  nativeDamage: number;
  cancel(): void;
}

export interface IClientInternalEvents {
  [ClientInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ClientInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
  [ClientInternalEventName.PlayerReady]: (localPlayer: IPlayer) => void;
  [ClientInternalEventName.BrowserDomReady]: () => void;
  [ClientInternalEventName.EntityStreamIn]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityStreamOut]: (object: IBaseObject) => void;
  [ClientInternalEventName.PlayerEnterVehicle]: (vehicle: IVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerLeaveVehicle]: (vehicle: IVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerDeath]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerSpawn]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerWeaponShot]: () => void;
  [ClientInternalEventName.OutgoingDamage]: (event: IOutgoingDamageEvent) => void;
  [ClientInternalEventName.IncomingDamage]: (event: IIncomingDamageEvent) => void;
  [ClientInternalEventName.Render]: () => void;
  [ClientInternalEventName.Click]: (options: IClickOptions) => void;
  [ClientInternalEventName.SyncedMetaChange]: (
    object: IBaseObject,
    key: string,
    value: unknown,
    oldValue: unknown,
  ) => void;
}
