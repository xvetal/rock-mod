import { type IEntitiesManager } from "../entity/IEntitiesManager";
import { type IRockModPlayer } from "./IRockModPlayer";

export interface IPlayersManager extends IEntitiesManager<IRockModPlayer> {
  getByName(name: string): IRockModPlayer;
  findByName(name: string): IRockModPlayer | null;
  findLocalPlayer(): IRockModPlayer | null;
  getLocalPlayer(): IRockModPlayer;
}
