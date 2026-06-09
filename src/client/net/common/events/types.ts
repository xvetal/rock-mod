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
  [ClientInternalEventName.Render]: () => void;
  [ClientInternalEventName.Click]: (options: IClickOptions) => void;
  [ClientInternalEventName.SyncedMetaChange]: (entity: IEntity, key: string, value: unknown, oldValue: unknown) => void;
}
