import { type IBaseObject, type IEntity, type IPlayer, type IVehicle } from "@RockMod/client/entities";

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
}

export interface IClientInternalEvents {
  [ClientInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ClientInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
  [ClientInternalEventName.PlayerReady]: (localPlayer: IPlayer) => void;
  [ClientInternalEventName.BrowserDomReady]: () => void;
  [ClientInternalEventName.EntityStreamIn]: (entity: IEntity) => void;
  [ClientInternalEventName.EntityStreamOut]: (entity: IEntity) => void;
  [ClientInternalEventName.PlayerEnterVehicle]: (vehicle: IVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerLeaveVehicle]: (vehicle: IVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerDeath]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerSpawn]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerWeaponShot]: () => void;
}
