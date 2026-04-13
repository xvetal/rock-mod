import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { type RageEventsManager } from "./RageEventsManager";
import { RockMod } from "@RockMod/client/RockMod";
import { type IRockModPlayer, type IRockModVehicle } from "@RockMod/client/entities/common";
import { type IEventsBridge } from "@RockMod/client/net/common/events/IEventsBridge";
import { ServerToClientEventName } from "@shared/net/common/events/types";
import { RageEntityPoolRouter } from "../../../entities/ragemp/router/RageEntityPoolRouter";

export class RageEventsBridge implements IEventsBridge {
  private readonly _events: RageEventsManager;

  private readonly _entityPoolRouter: RageEntityPoolRouter;

  public constructor(events: RageEventsManager) {
    this._events = events;
    this._entityPoolRouter = new RageEntityPoolRouter();
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
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IRockModPlayer;
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

        const player = playersManager.unregisterById(mpPlayer.id);
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDisconnected, player);
      },

      entityStreamIn: (mpEntity) => {
        const entity = this._entityPoolRouter.resolveFromMp(mpEntity);
        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamIn, entity);
      },

      entityStreamOut: (mpEntity) => {
        const entity = this._entityPoolRouter.resolveFromMp(mpEntity);
        if (!entity) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.EntityStreamOut, entity);
      },

      playerEnterVehicle: (mpVehicle, seat) => {
        const vehicle = this._entityPoolRouter.registerFromMp(mpVehicle) as IRockModVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, vehicle, seat);
      },

      playerLeaveVehicle: (mpVehicle, seat) => {
        const vehicle = this._entityPoolRouter.resolveFromMp(mpVehicle) as IRockModVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerLeaveVehicle, vehicle, seat);
      },

      playerDeath: (mpPlayer) => {
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IRockModPlayer;
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDeath, player);
      },

      playerSpawn: (mpPlayer) => {
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IRockModPlayer;
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
        this._entityPoolRouter.registerByDto(serverEntity);
      },
      [ServerToClientEventName.EntityDestroyed]: (serverEntity) => {
        this._entityPoolRouter.unregisterByDto(serverEntity);
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
}
