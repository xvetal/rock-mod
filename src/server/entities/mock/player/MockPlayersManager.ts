import { IPlayersManager } from "../../common/player/IPlayersManager";
import { MockPlayer } from "./MockPlayer";
import { MockEntitiesManager } from "../entity/MockEntitiesManager";

export class MockPlayersManager extends MockEntitiesManager<MockPlayer> implements IPlayersManager {
  public constructor() {
    super({
      baseObjectsType: "player",
    });
  }

  public getByName(name: string): MockPlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): MockPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }

  public getBySocialClub(socialClub: string): MockPlayer {
    const player = this.findBySocialClub(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): MockPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
  }
}
