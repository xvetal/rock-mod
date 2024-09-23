import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVPlayer } from "./AltVPlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";

export class AltVPlayersManager extends AltVEntitiesManager<AltVPlayer> implements IPlayersManager {
  public constructor() {
    super({
      baseObjectsType: "player",
    });
  }
}
