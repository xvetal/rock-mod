import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type RageEventsManager } from "./RageEventsManager";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEntity, type IRockModVehicle } from "@RockMod/client/entities/common";
import { type RagePlayer } from "@RockMod/client/entities/ragemp/player/RagePlayer";
import { type RagePlayersManager } from "@RockMod/client/entities/ragemp/player/RagePlayersManager";
import { type RageVehiclesManager } from "@RockMod/client/entities/ragemp/vehicle/RageVehiclesManager";
import { type RageObjectsManager } from "@RockMod/client/entities/ragemp/object/RageObjectsManager";
import { type RagePedsManager } from "@RockMod/client/entities/ragemp/ped/RagePedsManager";
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
        this._syncEntityPools();
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

        // Stream-out only affects visibility; registry cleanup still happens on entityDestroyed.
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

  private _getVehiclesManager(): RageVehiclesManager | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    return rockMod.vehicles as RageVehiclesManager;
  }

  private _getObjectsManager(): RageObjectsManager | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    return rockMod.objects as RageObjectsManager;
  }

  private _getPedsManager(): RagePedsManager | null {
    const rockMod = this._getRockMod();
    if (!rockMod) {
      return null;
    }

    return rockMod.peds as RagePedsManager;
  }

  private _syncEntityPools(): void {
    this._getVehiclesManager()?.syncWithMpPool();
    this._getObjectsManager()?.syncWithMpPool();
    this._getPedsManager()?.syncWithMpPool();
  }

  private _resolvePlayer(mpPlayer: PlayerMp): RagePlayer | null {
    const playersManager = this._getPlayersManager();
    if (!playersManager) {
      return null;
    }

    return playersManager.registerFromMp(mpPlayer);
  }

  private _resolveVehicle(mpVehicle: VehicleMp): IRockModVehicle | null {
    const vehiclesManager = this._getVehiclesManager();
    if (!vehiclesManager) {
      return null;
    }

    return vehiclesManager.registerFromMp(mpVehicle);
  }

  private _resolveObject(mpObject: ObjectMp): IEntity | null {
    const objectsManager = this._getObjectsManager();
    if (!objectsManager) {
      return null;
    }

    return objectsManager.registerFromMp(mpObject);
  }

  private _resolvePed(mpPed: PedMp): IEntity | null {
    const pedsManager = this._getPedsManager();
    if (!pedsManager) {
      return null;
    }

    return pedsManager.registerFromMp(mpPed);
  }

  private _resolveEntity(mpEntity: EntityMp): IEntity | null {
    switch (mpEntity.type) {
      case "player":
        return this._resolvePlayer(mpEntity as PlayerMp);
      case "vehicle":
        return this._resolveVehicle(mpEntity as VehicleMp);
      case "object":
        return this._resolveObject(mpEntity as ObjectMp);
      case "ped":
        return this._resolvePed(mpEntity as PedMp);
      default:
        return null;
    }
  }
}
