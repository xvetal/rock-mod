import { type IBaseObject, type IColshape, type IPlayer, type IVehicle } from "../../../entities";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

/** Frozen final values in SDK coordinates, supplied by platforms with historical exit state. */
export interface IPlayerQuitSnapshot {
  readonly id: number;
  readonly health: number;
  readonly weaponAmmo: number;
  readonly position: Readonly<Pick<IVector3D, "x" | "y" | "z">>;
  readonly heading: number;
  readonly dimension: number;
}

export enum ServerInternalEventName {
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  PlayerQuit = "rm::playerQuit",
  PlayerDeath = "rm::playerDeath",
  PlayerDamage = "rm::playerDamage",
  PlayerEnterVehicle = "rm::playerEnterVehicle",
  PlayerExitVehicle = "rm::playerExitVehicle",
  PlayerEnteredColshape = "rm::playerEnteredColshape",
  PlayerLeftColshape = "rm::playerLeftColshape",
  PlayerDimensionChange = "rm::playerDimensionChange",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
}

export interface IServerInternalEvents {
  [ServerInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerQuit]: (
    player: IPlayer,
    exitType: string,
    reason: string,
    snapshot?: IPlayerQuitSnapshot,
  ) => void;
  [ServerInternalEventName.PlayerDeath]: (player: IPlayer, reason: number, killer: IPlayer | null) => void;
  [ServerInternalEventName.PlayerDamage]: (player: IPlayer, healthLoss: number, armourLoss: number) => void;
  [ServerInternalEventName.PlayerEnterVehicle]: (player: IPlayer, vehicle: IVehicle, seat: number) => void;
  [ServerInternalEventName.PlayerExitVehicle]: (player: IPlayer, vehicle: IVehicle) => void;
  [ServerInternalEventName.PlayerEnteredColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.PlayerLeftColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.PlayerDimensionChange]: (
    player: IPlayer,
    oldDimension: number,
    newDimension: number,
  ) => void;
  [ServerInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ServerInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
}
