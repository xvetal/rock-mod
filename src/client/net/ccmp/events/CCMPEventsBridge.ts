/// <reference types="@classic-mp/types/client" />
import { type IVehicle } from "@RockMod/client/entities/common";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { type CCMPEventsManager } from "./CCMPEventsManager";

interface ICCMPVehicleEventPayload {
  readonly vehicle?: {
    readonly id?: unknown;
  } | null;
  readonly seat?: unknown;
}

/**
 * Legacy bridge slot for CCMP raw events.
 *
 * Player lifecycle and stream events are handled by `CCMPPlayersManager`,
 * because it can resolve every native `ccmp.players.Player` into the stable
 * Rock-Mod `CCMPPlayer` instance before emitting internal `rm::*` events.
 */
export class CCMPEventsBridge implements IEventsBridge {
  public constructor(private readonly _events: CCMPEventsManager) {}

  public registerRawEvents(): void {
    this._events.register("playerEnterVehicle", (payload) => {
      const event = this._resolveVehicleEventPayload(payload);
      if (!event) return;

      this._events.emitInternal(ClientInternalEventName.PlayerEnterVehicle, event.vehicle, event.seat);
    });

    this._events.register("playerLeaveVehicle", (payload) => {
      const event = this._resolveVehicleEventPayload(payload);
      if (!event) return;

      this._events.emitInternal(ClientInternalEventName.PlayerLeaveVehicle, event.vehicle, event.seat);
    });
  }

  public registerServerEvents(): void {
    // No-op: ранее тут жил handler для cooperation `rm::clientReady`-ответа.
    // Теперь это responsibility `CCMPPlayersManager`.
  }

  private _resolveVehicleEventPayload(payload: unknown): { vehicle: IVehicle; seat: number } | null {
    const ccmpPayload = payload as ICCMPVehicleEventPayload | null;
    const ccmpVehicleId = ccmpPayload?.vehicle?.id;

    if (typeof ccmpVehicleId !== "number" || !Number.isFinite(ccmpVehicleId)) {
      return null;
    }

    const rawSeat = Number(ccmpPayload?.seat);
    const seat = Number.isFinite(rawSeat) ? rawSeat : -1;

    try {
      const vehicle = RockMod.instance.vehicles.registerById(ccmpVehicleId);
      return { vehicle, seat };
    } catch {
      return null;
    }
  }
}
