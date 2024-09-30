import { AltVEntitiesManager } from "../entity/AltVEntitiesManager";
import { AltVPlayer } from "./AltVPlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";
import { AltVNetManager } from "../../../net/altv/AltVNetManager";

export class AltVPlayersManager extends AltVEntitiesManager<AltVPlayer> implements IPlayersManager {
  public constructor(net: AltVNetManager) {
    super({
      baseObjectsType: "player",
      net,
    });
  }

  public getByName(name: string): AltVPlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): AltVPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }

  public getBySocialClub(socialClub: string): AltVPlayer {
    const player = this.findByName(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): AltVPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
  }
}
