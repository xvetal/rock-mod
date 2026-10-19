import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type IPlayer } from "../../common/player/IPlayer";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxPlayersManager extends RockSandboxEntitiesManager<IPlayer> implements IPlayersManager {
  public getByName(_name: string): IPlayer {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.getByName");
  }

  public findByName(_name: string): IPlayer | null {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.findByName");
  }

  public findByRemoteId(_remoteId: number): IPlayer | null {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.findByRemoteId");
  }

  public getByRemoteId(_remoteId: number): IPlayer {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.getByRemoteId");
  }

  public findLocalPlayer(): IPlayer | null {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.findLocalPlayer");
  }

  public getLocalPlayer(): IPlayer {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.getLocalPlayer");
  }
}
