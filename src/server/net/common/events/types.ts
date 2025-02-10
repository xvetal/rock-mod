import { type IBaseObject, type IColshape, type IPlayer } from "../../../entities";

export enum ServerInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  PlayerEnteredColshape = "rm::playerEnteredColshape",
  PlayerLeftColshape = "rm::playerLeftColshape",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
}

export interface IServerInternalEvents {
  [ServerInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerEnteredColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.PlayerLeftColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ServerInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
}
