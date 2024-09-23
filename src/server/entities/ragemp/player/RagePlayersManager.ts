import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";

export class RagePlayersManager extends RageEntitiesManager<RagePlayer> implements IPlayersManager {
  public constructor() {
    super({
      baseObjectsType: "player",
    });
  }
}
