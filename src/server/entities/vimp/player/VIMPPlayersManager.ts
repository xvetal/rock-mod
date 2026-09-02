import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { CCMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { CCMPPlayer } from "./VIMPPlayer";
import { type CCMPNetManager } from "../../../net/vimp/VIMPNetManager";
import { ServerInternalEventName } from "../../../net/common/events/types";
import { RockMod } from "../../../RockMod";

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

  public getBySocialClub(socialClub: string): CCMPPlayer {
    const player = this.findBySocialClub(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): CCMPPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
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
        net.events.emitInternal(ServerInternalEventName.PlayerQuit, player, "disconnect", "");
        this.unregisterBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerDisconnected, player);
      },
      playerDimensionChange: (ccmpPlayer, oldDim, newDim) => {
        const player = this.findByID(ccmpPlayer.id);
        if (!player) return;
        net.events.emitInternal(ServerInternalEventName.PlayerDimensionChange, player, oldDim, newDim);
      },
      playerEnterVehicle: (ccmpPlayer, ccmpVehicle, seat) => {
        const player = this.findByID(ccmpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(ccmpVehicle.id);
        if (!player || !vehicle) return;

        net.events.emitInternal(ServerInternalEventName.PlayerEnterVehicle, player, vehicle, seat);
      },
      playerExitVehicle: (ccmpPlayer, ccmpVehicle) => {
        const player = this.findByID(ccmpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(ccmpVehicle.id);
        if (!player || !vehicle) return;

        net.events.emitInternal(ServerInternalEventName.PlayerExitVehicle, player, vehicle);
      },
    });
  }
}
