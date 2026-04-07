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
      this.registerFromMp(mpPlayer);
    }
  }

  public registerFromMp(mpPlayer: PlayerMp): RagePlayer {
    const existingPlayer = this.findByID(mpPlayer.id);
    if (existingPlayer) {
      return existingPlayer;
    }

    mpPlayer.isExists = (): boolean => mp.players.exists(mpPlayer);
    const player = new RagePlayer({
      mpEntity: mpPlayer,
    });
    this.registerBaseObject(player);

    return player;
  }

  public unregisterFromMp(mpPlayer: PlayerMp): RagePlayer | null {
    const player = this.findByID(mpPlayer.id);
    if (!player) {
      return null;
    }

    this.unregisterBaseObject(player);
    return player;
  }
}
