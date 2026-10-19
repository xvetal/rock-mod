import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type IPlayer } from "../../common/player/IPlayer";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxPlayersManager extends RockSandboxEntitiesManager<IPlayer> implements IPlayersManager {
  public getByName(_name: string): IPlayer {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.getByName");
  }

  public findByName(_name: string): IPlayer | null {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.findByName");
  }

  public getBySocialClub(_socialClub: string): IPlayer {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.getBySocialClub");
  }

  public findBySocialClub(_socialClub: string): IPlayer | null {
    return rockSandboxNotImplemented("server", "RockSandboxPlayersManager.findBySocialClub");
  }
}
