import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type IPlayer } from "../../common/player/IPlayer";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPlayer, wrapPlayer } from "./RockSandboxPlayer";
import { RockSandboxPlayersIterator } from "./RockSandboxPlayersIterator";
import { nativePlayers } from "./nativePlayers";

export class RockSandboxPlayersManager
  extends RockSandboxEntitiesManager<RockSandboxPlayer>
  implements IPlayersManager
{
  private readonly _playersIterator = new RockSandboxPlayersIterator();

  public override get iterator(): RockSandboxPlayersIterator {
    return this._playersIterator;
  }

  public override findByID(id: number): RockSandboxPlayer | null {
    const player = nativePlayers("findByID").getById(id);
    return player === null ? null : wrapPlayer(player);
  }

  public override getByID(id: number): RockSandboxPlayer {
    const player = this.findByID(id);
    if (player === null) {
      throw new Error(`[RockSandbox:server] RockSandboxPlayersManager.getByID: player ${id} not found`);
    }
    return player;
  }

  public getByName(name: string): RockSandboxPlayer {
    const player = this.findByName(name);
    if (player === null) {
      throw new Error(`[RockSandbox:server] RockSandboxPlayersManager.getByName: player ${name} not found`);
    }
    return player;
  }

  public findByName(name: string): RockSandboxPlayer | null {
    const player = nativePlayers("findByName")
      .all()
      .find((candidate) => candidate.name === name);
    return player === undefined ? null : wrapPlayer(player);
  }

  public getBySocialClub(_socialClub: string): IPlayer {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.getBySocialClub");
  }

  public findBySocialClub(_socialClub: string): IPlayer | null {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.findBySocialClub");
  }
}
