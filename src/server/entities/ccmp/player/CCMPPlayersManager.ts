import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { CCMPEntitiesManager } from "../entity/CCMPEntitiesManager";
import { CCMPPlayer } from "./CCMPPlayer";
import { type CCMPNetManager } from "../../../net/ccmp/CCMPNetManager";
import { ServerInternalEventName } from "../../../net/common/events/types";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPPlayersManager extends CCMPEntitiesManager<CCMPPlayer> implements IPlayersManager {
  public constructor(net: CCMPNetManager) {
    super({
      baseObjectsType: "player",
    });
    this._init(net);
  }

  public getByName(name: string): CCMPPlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): CCMPPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }

  public getBySocialClub(_socialClub: string): CCMPPlayer {
    return notImplemented("CCMPPlayersManager.getBySocialClub");
  }

  public findBySocialClub(_socialClub: string): CCMPPlayer | null {
    return notImplemented("CCMPPlayersManager.findBySocialClub");
  }

  private _init(net: CCMPNetManager): void {
    net.events.onInternal({
      playerConnected: (ccmpPlayer) => {
        const player = new CCMPPlayer({ ccmpPlayer });
        this.registerBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerConnected, player);
      },
      playerDisconnected: (ccmpPlayer) => {
        const player = this.getByID(ccmpPlayer.id);
        net.events.emitInternal(ServerInternalEventName.PlayerDisconnected, player);
        this.unregisterBaseObject(player);
      },
    });
  }
}
