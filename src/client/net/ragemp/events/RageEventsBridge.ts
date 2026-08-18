import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEntity, type IEntityPoolRouter, type IPlayer, type IVehicle } from "@RockMod/client/entities/common";
import { type IEventsBridge } from "@RockMod/client/net/common/events/IEventsBridge";
import { ServerToClientEventName } from "@shared/net/common/events/types";
import { type IEventsManager } from "@RockMod/client/net/common/events/IEventsManager";
import { Vector3D } from "@shared/common/utils";

export class RageEventsBridge implements IEventsBridge {
  private readonly _events: IEventsManager;

  private readonly _entityPoolRouter: IEntityPoolRouter;

  private _lastEnteredVehicle: IVehicle | null = null;

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

        mp.game.weapon.setEnableLocalOutgoingDamage(true);
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
        const vehicle = this._entityPoolRouter.registerFromMp(mpVehicle) as IVehicle | null;
        if (!vehicle) {
          return;
        }

        this._lastEnteredVehicle = vehicle;
        this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, vehicle, seat);
      },

      playerLeaveVehicle: (mpVehicle, seat) => {
        const vehicle =
          (this._entityPoolRouter.resolveFromMp(mpVehicle) as IVehicle | null) ?? this._lastEnteredVehicle;
        if (!vehicle) {
          return;
        }

        this._lastEnteredVehicle = null;
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

      outgoingDamage: (sourceEntity, targetEntity, targetPlayer, weaponHash, boneIndex, nativeDamage) => {
        let cancelled = false;

        this._events.emitInternal(ClientInternalEventName.OutgoingDamage, {
          source: this._resolveOrRegisterEntity(sourceEntity),
          target: this._resolveOrRegisterEntity(targetEntity),
          targetPlayer: this._resolveOrRegisterPlayer(targetPlayer),
          weaponHash,
          boneIndex,
          nativeDamage,
          cancel: () => {
            cancelled = true;
          },
        });

        return cancelled;
      },

      incomingDamage: (sourceEntity, sourcePlayer, targetEntity, weaponHash, boneIndex, nativeDamage) => {
        let cancelled = false;

        this._events.emitInternal(ClientInternalEventName.IncomingDamage, {
          source: this._resolveOrRegisterEntity(sourceEntity),
          sourcePlayer: this._resolveOrRegisterPlayer(sourcePlayer),
          target: this._resolveOrRegisterEntity(targetEntity),
          weaponHash,
          boneIndex,
          nativeDamage,
          cancel: () => {
            cancelled = true;
          },
        });

        return cancelled;
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
        relativeX?: number,
        relativeY?: number,
        worldPosition?: Vector3,
        hitEntity?: number,
      ) => {
        const clickedWorldPosition = worldPosition
          ? new Vector3D(worldPosition.x, worldPosition.y, worldPosition.z)
          : null;

        this._events.emitInternal(ClientInternalEventName.Click, {
          absoluteX,
          absoluteY,
          upOrDown,
          leftOrRight,
          relativeX: relativeX ?? null,
          relativeY: relativeY ?? null,
          hitEntity: hitEntity ?? null,
          worldPosition: clickedWorldPosition,
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

  private _resolveOrRegisterEntity(mpEntity: EntityMp | null | undefined): IEntity | null {
    return this._entityPoolRouter.resolveFromMp(mpEntity) ?? this._entityPoolRouter.registerFromMp(mpEntity);
  }

  private _resolveOrRegisterPlayer(mpPlayer: PlayerMp | null | undefined): IPlayer | null {
    return this._resolveOrRegisterEntity(mpPlayer) as IPlayer | null;
  }
}
