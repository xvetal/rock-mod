import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { type IPlayersManager, type IRockModPlayer } from "../../common";

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

  public findLocalPlayer(): RagePlayer | null {
    return this.findByID(mp.players.local.id);
  }

  public getLocalPlayer(): IRockModPlayer {
    const localPlayer = this.findLocalPlayer();
    if (!localPlayer) {
      throw new Error(`Local player with id ${mp.players.local.id} not found`);
    }

    return localPlayer;
  }

  public syncWithMpPool(): void {
    for (const mpPlayer of mp.players.toArray()) {
      this.registerByRemoteId(mpPlayer.remoteId);
    }
  }

  public registerByRemoteId(remoteId: number): RagePlayer {
    const existingPlayer = this.findByID(remoteId);
    if (existingPlayer) {
      return existingPlayer;
    }

    const mpPlayer = mp.players.atRemoteId(remoteId);

    mpPlayer.isExists = (): boolean => mp.players.exists(mpPlayer);
    const player = new RagePlayer({
      mpEntity: mpPlayer,
    });
    this.registerBaseObject(player);

    return player;
  }
}
