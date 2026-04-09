import { type IBaseObject, type IEntity, type IRockModPlayer, type IRockModVehicle } from "@RockMod/client/entities";

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
  [ClientInternalEventName.PlayerConnected]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.PlayerDisconnected]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
  [ClientInternalEventName.PlayerReady]: (localPlayer: IRockModPlayer) => void;
  [ClientInternalEventName.BrowserDomReady]: () => void;
  [ClientInternalEventName.EntityStreamIn]: (entity: IEntity) => void;
  [ClientInternalEventName.EntityStreamOut]: (entity: IEntity) => void;
  [ClientInternalEventName.PlayerEnterVehicle]: (vehicle: IRockModVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerLeaveVehicle]: (vehicle: IRockModVehicle, seat: number) => void;
  [ClientInternalEventName.PlayerDeath]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.PlayerSpawn]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.PlayerWeaponShot]: () => void;
}
