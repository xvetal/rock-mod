import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";
import { RockMod } from "../../../RockMod";
import { RageNetManager } from "../../../net/ragemp/RageNetManager";

export class RagePlayersManager extends RageEntitiesManager<RagePlayer> implements IPlayersManager {
  public constructor(net: RageNetManager) {
    super({
      baseObjectsType: "player",
    });
    this._init(net);
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

  private _init(net: RageNetManager): void {
    net.events.on({
      playerJoin: (mpPlayer) => {
        mpPlayer.isExists = (): boolean => mp.players.exists(mpPlayer);
        const player = new RagePlayer({
          mpEntity: mpPlayer,
        });

        this.registerBaseObject(player);
        RockMod.instance.net.events.emit("rm::playerConnected", player);
      },
      playerQuit: (mpPlayer) => {
        const player = this.getByID(mpPlayer.id);

        this.unregisterBaseObject(player);
        net.events.emit("rm::playerDisconnected", player);
      },
    });
  }
}
