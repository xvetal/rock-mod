import { type IEntitiesManager } from "../entity/IEntitiesManager";
import { type IPlayer } from "./IPlayer";

export interface IPlayersManager extends IEntitiesManager<IPlayer> {
  getByName(name: string): IPlayer;
  findByName(name: string): IPlayer | null;
  findByRemoteId(remoteId: number): IPlayer | null;
  getByRemoteId(remoteId: number): IPlayer;
  /** Reads the current local player without a preceding syncWithMpPool() call. */
  findLocalPlayer(): IPlayer | null;
  /** Same lookup contract; throws if the local player is not available. */
  getLocalPlayer(): IPlayer;
}
