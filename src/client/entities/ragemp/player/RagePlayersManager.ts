import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type RageNetManager } from "../../../net/ragemp/RageNetManager";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";

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

  private _init(net: RageNetManager): void {
    net.events.onInternal({
      playerJoin: (mpPlayer) => {
        mpPlayer.isExists = (): boolean => mp.players.exists(mpPlayer);
        const player = new RagePlayer({
          mpEntity: mpPlayer,
        });

        this.registerBaseObject(player);
        net.events.emitInternal(ClientInternalEventName.PlayerConnected, player);
      },
      playerQuit: (mpPlayer) => {
        const player = this.getByID(mpPlayer.id);

        this.unregisterBaseObject(player);
        net.events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
      },
    });
  }
}
