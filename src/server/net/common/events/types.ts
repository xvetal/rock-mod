import { type IBaseObject, type IPlayer } from "../../../entities";

export enum ServerInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
}

export interface IServerInternalEvents {
  [ServerInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ServerInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ServerInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
}
