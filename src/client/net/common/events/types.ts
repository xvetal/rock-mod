import { type IBaseObject, type IRockModPlayer } from "@RockMod/client/entities";

export enum ClientInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
  PlayerReady = "rm::playerReady",
}

export interface IClientInternalEvents {
  [ClientInternalEventName.PlayerConnected]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.PlayerDisconnected]: (player: IRockModPlayer) => void;
  [ClientInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
  [ClientInternalEventName.PlayerReady]: (localPlayer: IRockModPlayer) => void;
}
