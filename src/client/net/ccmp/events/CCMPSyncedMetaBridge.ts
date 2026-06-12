/// <reference types="@classic-mp/types/client" />
import { type IBaseObject } from "@RockMod/client/entities";
import { type CCMPBlipsManager } from "@RockMod/client/entities/ccmp/blip/CCMPBlipsManager";
import { type CCMPColshapesManager } from "@RockMod/client/entities/ccmp/colshape/CCMPColshapesManager";
import { type CCMPMarkersManager } from "@RockMod/client/entities/ccmp/marker/CCMPMarkersManager";
import { type CCMPObjectsManager } from "@RockMod/client/entities/ccmp/object/CCMPObjectsManager";
import { type CCMPPedsManager } from "@RockMod/client/entities/ccmp/ped/CCMPPedsManager";
import { type CCMPPlayersManager } from "@RockMod/client/entities/ccmp/player/CCMPPlayersManager";
import { type CCMPVehiclesManager } from "@RockMod/client/entities/ccmp/vehicle/CCMPVehiclesManager";
import { ClientInternalEventName } from "../../common/events/types";
import { type CCMPEventsManager } from "./CCMPEventsManager";

export interface ICCMPSyncedMetaBridgeManagers {
  blips: CCMPBlipsManager;
  colshapes: CCMPColshapesManager;
  markers: CCMPMarkersManager;
  objects: CCMPObjectsManager;
  peds: CCMPPedsManager;
  players: CCMPPlayersManager;
  vehicles: CCMPVehiclesManager;
}

/**
 * Translates CCMP `streamSyncedMetaChange` into Rock-Mod's internal
 * `rm::syncedMetaChange` for stream-synced base objects.
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
      const object = this._resolveObject(payload.entityType, payload.entityId);
      if (!object) {
        return;
      }

      this._events.emitInternal(
        ClientInternalEventName.SyncedMetaChange,
        object,
        payload.key,
        payload.newValue,
        payload.oldValue,
      );
    });
  }

  private _resolveObject(entityType: number, entityId: number): IBaseObject | null {
    switch (entityType) {
      case ccmp.entities.ENTITY_TYPE.Player:
        return this._managers.players.findByRemoteId(entityId);
      case ccmp.entities.ENTITY_TYPE.Vehicle:
        return this._managers.vehicles.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Object:
        return this._managers.objects.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Ped:
        return this._managers.peds.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Marker:
        return this._managers.markers.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Blip:
        return this._managers.blips.findByRemoteID(entityId);
      case ccmp.entities.ENTITY_TYPE.Colshape:
        return this._managers.colshapes.findByRemoteID(entityId);
      default:
        return null;
    }
  }
}
