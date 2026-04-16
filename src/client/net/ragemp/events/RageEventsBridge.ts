import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEntityPoolRouter, type IPlayer, type IVehicle } from "@RockMod/client/entities/common";
import { type IEventsBridge } from "@RockMod/client/net/common/events/IEventsBridge";
import { ServerToClientEventName } from "@shared/net/common/events/types";
import { type IEventsManager } from "@RockMod/client/net/common/events/IEventsManager";
import { Vector3D } from "@shared/common/utils";

export class RageEventsBridge implements IEventsBridge {
  private readonly _events: IEventsManager;

  private readonly _entityPoolRouter: IEntityPoolRouter;

  public constructor(events: IEventsManager, entityPoolRouter: IEntityPoolRouter) {
    this._events = events;
    this._entityPoolRouter = entityPoolRouter;
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
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IPlayer;
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
        const vehicle = this._entityPoolRouter.registerFromMp(mpVehicle) as IVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, vehicle, seat);
      },

      playerLeaveVehicle: (mpVehicle, seat) => {
        const vehicle = this._entityPoolRouter.resolveFromMp(mpVehicle) as IVehicle;
        if (!vehicle) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerLeaveVehicle, vehicle, seat);
      },

      playerDeath: (mpPlayer) => {
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IPlayer;
        if (!player) {
          return;
        }

        this._events.emitInternal(ClientInternalEventName.PlayerDeath, player);
      },

      playerSpawn: (mpPlayer) => {
        const player = this._entityPoolRouter.registerFromMp(mpPlayer) as IPlayer;
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

      render: () => {
        this._events.emitInternal(ClientInternalEventName.Render);
      },

      click: (
        absoluteX: number,
        absoluteY: number,
        upOrDown: "up" | "down",
        leftOrRight: "left" | "right",
        relativeX: number,
        relativeY: number,
        worldPosition: Vector3,
        hitEntity: number,
      ) => {
        const { x, y, z } = worldPosition;

        this._events.emitInternal(ClientInternalEventName.Click, {
          absoluteX,
          absoluteY,
          upOrDown,
          leftOrRight,
          relativeX,
          relativeY,
          hitEntity,
          worldPosition: new Vector3D(x, y, z),
        });
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
