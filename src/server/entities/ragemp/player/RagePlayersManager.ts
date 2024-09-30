import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { IPlayersManager } from "../../common/player/IPlayersManager";
import { RageNetManager } from "../../../net/ragemp/RageNetManager";
import { BaseObjectType } from "../../common/baseObject/IBaseObject";
import PlayerMP = RageMP.PlayerMP;
import { Vector3D } from "../../../common/utils/math/Vectors";

export class RagePlayersManager extends RageEntitiesManager<RagePlayer> implements IPlayersManager {
  private readonly _net: RageNetManager;

  public constructor(net: RageNetManager) {
    super({
      baseObjectsType: "player",
    });
    this._net = net;
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
    this._net.events.on("playerJoin", (mpPlayer: PlayerMP) => {
      const { x, y, z } = mpPlayer.position;
      const player = new RagePlayer({
        entity: mpPlayer,
        id: mpPlayer.id,
        type: BaseObjectType.Player,
        model: mpPlayer.model,
        name: mpPlayer.name,
        socialClub: mpPlayer.socialClub,
        dimension: mpPlayer.dimension,
        position: new Vector3D(x, y, z),
      });

      this.baseObjects.set(player.id, player);
      this._net.events.emit("playerConnected", player);
    });
    this._net.events.on("playerQuit", (mpPlayer: PlayerMP) => {
      const player = this.getByID(mpPlayer.id);

      this.baseObjects.delete(player.id);
      this._net.events.emit("playerDisconnected", player);
    });
  }
}
