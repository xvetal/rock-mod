import { type IEntitiesManager } from "../entity/IEntitiesManager";
import { type IPlayer } from "./IPlayer";

export interface IPlayersManager extends IEntitiesManager<IPlayer> {
  getByName(name: string): IPlayer;
  findByName(name: string): IPlayer | null;
  findByRemoteId(remoteId: number): IPlayer | null;
  getByRemoteId(remoteId: number): IPlayer;
  findLocalPlayer(): IPlayer | null;
  getLocalPlayer(): IPlayer;
}
