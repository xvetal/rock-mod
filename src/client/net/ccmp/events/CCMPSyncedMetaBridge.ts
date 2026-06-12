/// <reference types="@classic-mp/types/client" />
import { type IEntity } from "@RockMod/client/entities";
import { type CCMPObjectsManager } from "@RockMod/client/entities/ccmp/object/CCMPObjectsManager";
import { type CCMPPedsManager } from "@RockMod/client/entities/ccmp/ped/CCMPPedsManager";
import { type CCMPPlayersManager } from "@RockMod/client/entities/ccmp/player/CCMPPlayersManager";
import { type CCMPVehiclesManager } from "@RockMod/client/entities/ccmp/vehicle/CCMPVehiclesManager";
import { ClientInternalEventName } from "../../common/events/types";
import { type CCMPEventsManager } from "./CCMPEventsManager";

export interface ICCMPSyncedMetaBridgeManagers {
  objects: CCMPObjectsManager;
  peds: CCMPPedsManager;
  players: CCMPPlayersManager;
  vehicles: CCMPVehiclesManager;
}

/**
 * Translates CCMP `streamSyncedMetaChange` into Rock-Mod's internal
 * `rm::syncedMetaChange` for entity-backed types. UI/world-only wrappers
 * (marker, blip, colshape) are intentionally left out because IDataHandler
 * callbacks are typed as IEntity.
 */
export class CCMPSyncedMetaBridge {
  private readonly _events: CCMPEventsManager;

  private readonly _managers: ICCMPSyncedMetaBridgeManagers;

  private _registered = false;

  public constructor(events: CCMPEventsManager, managers: ICCMPSyncedMetaBridgeManagers) {
    this._events = events;
    this._managers = managers;
  }

  public register(): void {
    if (this._registered) {
      return;
    }
    this._registered = true;

    ccmp.on("streamSyncedMetaChange", (payload) => {
      const entity = this._resolveEntity(payload.entityType, payload.entityId);
      if (!entity) {
        return;
      }

      this._events.emitInternal(
        ClientInternalEventName.SyncedMetaChange,
        entity,
        payload.key,
        payload.newValue,
        payload.oldValue,
      );
    });
  }

  private _resolveEntity(entityType: number, entityId: number): IEntity | null {
    switch (entityType) {
      case ccmp.entities.ENTITY_TYPE.Player:
        return this._managers.players.findByRemoteId(entityId);
      case ccmp.entities.ENTITY_TYPE.Vehicle:
        return this._managers.vehicles.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Object:
        return this._managers.objects.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Ped:
        return this._managers.peds.findByRemoteID(entityId);
      default:
        return null;
    }
  }
}
