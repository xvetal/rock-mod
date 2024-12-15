import { IBaseObject, IPlayer } from "@RockMod/client/entities";

export enum ClientInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
}

export interface IClientInternalEvents {
  [ClientInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ClientInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ClientInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ClientInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
}
