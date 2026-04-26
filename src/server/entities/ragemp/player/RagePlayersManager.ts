import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { type RageNetManager } from "../../../net/ragemp/RageNetManager";
import { ServerInternalEventName } from "../../../net/common/events/types";
import { RockMod } from "../../../RockMod";
import { type RageVehicle } from "../vehicle/RageVehicle";

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
    net.events.onInternal({
      playerJoin: (mpPlayer) => {
        mpPlayer.isExists = (): boolean => mp.players.exists(mpPlayer);
        const player = new RagePlayer({
          mpEntity: mpPlayer,
        });

        this.registerBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerConnected, player);
      },
      playerQuit: (mpPlayer, exitType, reason) => {
        const player = this.getByID(mpPlayer.id);

        net.events.emitInternal(ServerInternalEventName.PlayerQuit, player, exitType, reason);
        this.unregisterBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerDisconnected, player);
      },
      playerDeath: (mpPlayer, reason, killer) => {
        const player = this.getByID(mpPlayer.id);
        const killerPlayer = killer ? (RockMod.instance.players.findByID(killer.id) ?? null) : null;

        net.events.emitInternal(ServerInternalEventName.PlayerDeath, player, reason, killerPlayer);
      },
      playerDamage: (mpPlayer, healthLoss, armourLoss) => {
        const player = this.getByID(mpPlayer.id);

        net.events.emitInternal(ServerInternalEventName.PlayerDamage, player, healthLoss, armourLoss);
      },
      playerEnterVehicle: (mpPlayer, mpVehicle, seat) => {
        const player = this.getByID(mpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(mpVehicle.id) as RageVehicle | null;
        if (!vehicle) {
          return;
        }

        net.events.emitInternal(ServerInternalEventName.PlayerEnterVehicle, player, vehicle, seat);
      },
      playerExitVehicle: (mpPlayer, mpVehicle) => {
        const player = this.getByID(mpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(mpVehicle.id) as RageVehicle | null;
        if (!vehicle) {
          return;
        }

        net.events.emitInternal(ServerInternalEventName.PlayerExitVehicle, player, vehicle);
      },
    });
  }
}
