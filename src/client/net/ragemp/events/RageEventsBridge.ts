import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type RageEventsManager } from "./RageEventsManager";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEntity, type IVehicle } from "@RockMod/client/entities/common";
import { type RagePlayer } from "@RockMod/client/entities/ragemp/player/RagePlayer";
import { type RagePlayersManager } from "@RockMod/client/entities/ragemp/player/RagePlayersManager";
import { type IEventsBridge } from "@RockMod/client/net/common/events/IEventsBridge";

export class RageEventsBridge implements IEventsBridge {
  private readonly _events: RageEventsManager;

  public constructor(events: RageEventsManager) {
    this._events = events;
  }

  public registerRawEvents(): void {
    this._events.onRaw({
      playerReady: () => {
        const playersManager = this._getPlayersManager();
        if (!playersManager) {
          return;
        }

        playersManager.syncWithMpPool();
        const localPlayer = playersManager.findLocalPlayer();
        if (!localPlayer) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerReady, localPlayer);
      },

      playerJoin: (mpPlayer) => {
        const playersManager = this._getPlayersManager();
        if (!playersManager) {
          return;
        }

        const player = playersManager.registerFromMp(mpPlayer);
        this._events.emitInternal(ClientInternalEventName.PlayerConnected, player);
      },

      playerQuit: (mpPlayer) => {
        const playersManager = this._getPlayersManager();
        if (!playersManager) {
          return;
        }

        const player = playersManager.unregisterFromMp(mpPlayer);
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
      },

      entityStreamIn: (mpEntity) => {
        const entity = this._resolveEntity(mpEntity);

        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamIn, entity);
      },

      entityStreamOut: (mpEntity) => {
        const entity = this._resolveEntity(mpEntity);

        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamOut, entity);
      },

      playerEnterVehicle: (mpVehicle, seat) => {
        const vehicle = this._resolveVehicle(mpVehicle);
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, vehicle, seat);
      },

      playerLeaveVehicle: (mpVehicle, seat) => {
        const vehicle = this._resolveVehicle(mpVehicle);
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerLeaveVehicle, vehicle, seat);
      },

      playerDeath: (mpPlayer) => {
        const player = this._resolvePlayer(mpPlayer);
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDeath, player);
      },

      playerSpawn: (mpPlayer) => {
        const player = this._resolvePlayer(mpPlayer);
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerSpawn, player);
      },

      playerWeaponShot: () => {
        this._events.emitInternal(ClientInternalEventName.PlayerWeaponShot);
      },

      browserDomReady: () => {
        this._events.emitInternal(ClientInternalEventName.BrowserDomReady);
      },
    });
  }

  private _getRockMod(): RockMod | null {
    try {
      return RockMod.instance;
    } catch {
      return null;
    }
  }

  private _getPlayersManager(): RagePlayersManager | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    return rockMod.players as RagePlayersManager;
  }

  private _resolvePlayer(mpPlayer: PlayerMp): RagePlayer | null {
    const playersManager = this._getPlayersManager();
    if (!playersManager) {
      return null;
    }

    return playersManager.registerFromMp(mpPlayer);
  }

  private _resolveVehicle(mpVehicle: VehicleMp): IVehicle | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    return rockMod.vehicles.findByID(mpVehicle.id);
  }

  private _resolveEntity(mpEntity: EntityMp): IEntity | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    switch (mpEntity.type) {
      case "player":
        return this._resolvePlayer(mpEntity as PlayerMp);
      case "vehicle":
        return rockMod.vehicles.findByID(mpEntity.id);
      case "object":
        return rockMod.objects.findByID(mpEntity.id);
      case "ped":
        return rockMod.peds.findByID(mpEntity.id);
      default:
        return null;
    }
  }
}
