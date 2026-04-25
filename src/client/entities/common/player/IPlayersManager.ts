import { type IEntitiesManager } from "../entity/IEntitiesManager";
import { type IPlayer } from "./IPlayer";

export interface IPlayersManager extends IEntitiesManager<IPlayer> {
  getByName(name: string): IPlayer;
  findByName(name: string): IPlayer | null;
  findLocalPlayer(): IPlayer | null;
  getLocalPlayer(): IPlayer;
}
