import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type RageEventsManager } from "./RageEventsManager";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEntity, type IRockModPlayer, type IRockModVehicle } from "@RockMod/client/entities/common";
import { type IEventsBridge } from "@RockMod/client/net/common/events/IEventsBridge";
import { ServerToClientEventName } from "@shared/net/common/events/types";
import { type IBaseObjectDto } from "@shared/entities/IBaseObject";

export class RageEventsBridge implements IEventsBridge {
  private readonly _events: RageEventsManager;

  public constructor(events: RageEventsManager) {
    this._events = events;
  }

  public registerRawEvents(): void {
    this._events.onRaw({
      playerReady: () => {
        const playersManager = this._rockMod?.players;
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
        const player = this._resolveEntityFromMp(mpPlayer) as IRockModPlayer;
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerConnected, player);
      },

      playerQuit: (mpPlayer) => {
        const playersManager = this._rockMod?.players;
        if (!playersManager) {
          return;
        }

        const player = playersManager.unregisterByRemoteId(mpPlayer.id);
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
      },

      entityStreamIn: (mpEntity) => {
        const entity = this._resolveEntityFromMp(mpEntity);
        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamIn, entity);
      },

      entityStreamOut: (mpEntity) => {
        const entity = this._resolveEntityFromMp(mpEntity);
        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamOut, entity);
      },

      playerEnterVehicle: (mpVehicle, seat) => {
        const vehicle = this._resolveEntityFromMp(mpVehicle) as IRockModVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, vehicle, seat);
      },

      playerLeaveVehicle: (mpVehicle, seat) => {
        const vehicle = this._resolveEntityFromMp(mpVehicle) as IRockModVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerLeaveVehicle, vehicle, seat);
      },

      playerDeath: (mpPlayer) => {
        const player = this._resolveEntityFromMp(mpPlayer) as IRockModPlayer;
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDeath, player);
      },

      playerSpawn: (mpPlayer) => {
        const player = this._resolveEntityFromMp(mpPlayer) as IRockModPlayer;
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

  public registerServerEvents(): void {
    this._events.onServer({
      [ServerToClientEventName.EntityCreated]: (serverEntity) => {
        this._registerEntityByDto(serverEntity);
      },
      [ServerToClientEventName.EntityDestroyed]: (serverEntity) => {
        this._unregisterEntityByDto(serverEntity);
      },
    });
  }

  private get _rockMod(): RockMod | null {
    try {
      return RockMod.instance;
    } catch {
      return null;
    }
  }

  private _syncEntityPools(): void {
    this._rockMod?.vehicles.syncWithMpPool();
    this._rockMod?.objects.syncWithMpPool();
    this._rockMod?.peds.syncWithMpPool();
  }

  private _registerEntityByDto(entity: IBaseObjectDto): IEntity | null {
    switch (entity.type) {
      case "player":
        return this._rockMod?.players.registerByRemoteId(entity.id) ?? null;
      case "vehicle":
        return this._rockMod?.vehicles.registerByRemoteId(entity.id) ?? null;
      case "object":
        return this._rockMod?.objects.registerByRemoteId(entity.id) ?? null;
      case "ped":
        return this._rockMod?.peds.registerByRemoteId(entity.id) ?? null;
      default:
        return null;
    }
  }

  private _unregisterEntityByDto(entity: IBaseObjectDto): IEntity | null {
    switch (entity.type) {
      case "player":
        return this._rockMod?.players.unregisterByRemoteId(entity.id) ?? null;
      case "vehicle":
        return this._rockMod?.vehicles.unregisterByRemoteId(entity.id) ?? null;
      case "object":
        return this._rockMod?.objects.unregisterByRemoteId(entity.id) ?? null;
      case "ped":
        return this._rockMod?.peds.unregisterByRemoteId(entity.id) ?? null;
      default:
        return null;
    }
  }

  private _resolveEntityFromMp(mpEntity: EntityMp): IEntity | null {
    switch (mpEntity.type) {
      case "player":
        return this._rockMod?.players.registerByRemoteId(mpEntity.remoteId) ?? null;
      case "vehicle":
        return this._rockMod?.vehicles.registerByRemoteId(mpEntity.remoteId) ?? null;
      case "object":
        return this._rockMod?.objects.registerByRemoteId(mpEntity.remoteId) ?? null;
      case "ped":
        return this._rockMod?.peds.registerByRemoteId(mpEntity.remoteId) ?? null;
      default:
        return null;
    }
  }
}
