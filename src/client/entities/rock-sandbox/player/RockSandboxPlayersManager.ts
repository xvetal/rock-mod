import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type IPlayer } from "../../common/player/IPlayer";
import { RockSandboxEntitiesManager } from "../entity/RockSandboxEntitiesManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPlayer, wrapPlayer } from "./RockSandboxPlayer";
import { RockSandboxPlayersIterator } from "./RockSandboxPlayersIterator";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxPlayersManager
  extends RockSandboxEntitiesManager<RockSandboxPlayer>
  implements IPlayersManager
{
  private readonly _playersIterator = new RockSandboxPlayersIterator();

  public override get iterator(): RockSandboxPlayersIterator {
    return this._playersIterator;
  }

  public override findByID(id: number): RockSandboxPlayer | null {
    const player = getRockSandbox().players.getConnectedById(id);
    return player === null ? null : wrapPlayer(player);
  }

  public override getByID(id: number): RockSandboxPlayer {
    const player = this.findByID(id);
    if (player === null)
      throw new Error(`[RockSandbox:client] RockSandboxPlayersManager.getByID: player ${id} not found`);
    return player;
  }

  public override findByRemoteID(id: number): RockSandboxPlayer | null {
    return this.findByID(id);
  }

  public override getByRemoteID(id: number): RockSandboxPlayer {
    return this.getByID(id);
  }

  public getByName(_name: string): IPlayer {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.getByName");
  }

  public findByName(_name: string): IPlayer | null {
    return rockSandboxNotImplemented("client", "RockSandboxPlayersManager.findByName");
  }

  public findByRemoteId(remoteId: number): RockSandboxPlayer | null {
    return this.findByID(remoteId);
  }

  public getByRemoteId(remoteId: number): RockSandboxPlayer {
    return this.getByID(remoteId);
  }

  public findLocalPlayer(): RockSandboxPlayer | null {
    const player = getRockSandbox().players.local;
    return player === null ? null : wrapPlayer(player);
  }

  public getLocalPlayer(): RockSandboxPlayer {
    const player = this.findLocalPlayer();
    if (player === null)
      throw new Error("[RockSandbox:client] RockSandboxPlayersManager.getLocalPlayer: local player not found");
    return player;
  }
}
