import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";
import { RageNetManager } from "../../../net/ragemp/RageNetManager";

export class RagePlayersManager extends RageEntitiesManager<RagePlayer> implements IPlayersManager {
  public constructor(net: RageNetManager) {
    super({
      baseObjectsType: "player",
      net,
    });
    this._init();
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

  public getBySocialClub(socialClub: string): RagePlayer {
    const player = this.findBySocialClub(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): RagePlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
  }

  private _init(): void {
    this.net.events.on("playerJoin", (mpPlayer: PlayerMp) => {
      const player = new RagePlayer({
        mpEntity: mpPlayer,
      });

      this.registerBaseObject(player);
      this.net.events.emit("playerConnected", player);
    });
    this.net.events.on("playerQuit", (mpPlayer: PlayerMp) => {
      const player = this.getByID(mpPlayer.id);

      this.unregisterBaseObject(player);
      this.net.events.emit("playerDisconnected", player);
    });
  }
}
