import { IEntitiesManager } from "../entity/IEntitiesManager";
import { IPlayer } from "./IPlayer";

export interface IPlayersManager extends IEntitiesManager<IPlayer> {
  getByName(name: string): IPlayer;
  findByName(name: string): IPlayer | null;
  getBySocialClub(socialClub: string): IPlayer;
  findBySocialClub(socialClub: string): IPlayer | null;
}
