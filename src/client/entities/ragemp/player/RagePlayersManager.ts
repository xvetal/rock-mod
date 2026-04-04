import { RageEntitiesManager } from "../entity/RageEntitiesManager";
import { RagePlayer } from "./RagePlayer";
import { type IPlayersManager, type IRockModPlayer } from "../../common";
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

  private _init(net: RageNetManager): void {
    net.events.onInternal({
      playerReady: () => {
        this._registerExistingPlayers();
        net.events.emitInternal(ClientInternalEventName.PlayerReady, this.getLocalPlayer());
      },

      playerJoin: (mpPlayer) => {
        const isAlreadyRegistered = Boolean(this.findByID(mpPlayer.id));
        const player = this._registerPlayer(mpPlayer);
        if (!isAlreadyRegistered) {
          net.events.emitInternal(ClientInternalEventName.PlayerConnected, player);
        }
      },
      playerQuit: (mpPlayer) => {
        const player = this.findByID(mpPlayer.id);
        if (!player) {
          return;
        }

        this.unregisterBaseObject(player);
        net.events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
      },
    });
  }

  private _registerExistingPlayers(): void {
    for (const mpPlayer of mp.players.toArray()) {
      this._registerPlayer(mpPlayer);
    }
  }

  private _registerPlayer(mpPlayer: PlayerMp): RagePlayer {
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
}
