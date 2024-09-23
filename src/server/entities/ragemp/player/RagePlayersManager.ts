import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";

export class RagePlayersManager extends RageEntitiesManager<RagePlayer> implements IPlayersManager {
  public constructor() {
    super({
      baseObjectsType: "player",
    });
  }

  public getByName(name: string): RagePlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): RagePlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }
}
