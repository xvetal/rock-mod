/// <reference types="@vimp-mp/types/client" />
import { type IVehicle } from "@RockMod/client/entities/common";
import { ClientInternalEventName } from "@RockMod/client/net/common/events/types";
import { RockMod } from "@RockMod/client/RockMod";
import { type IEventsBridge } from "../../common/events/IEventsBridge";
import { type VIMPEventsManager } from "./VIMPEventsManager";

interface IVIMPVehicleEventPayload {
  readonly vehicle?: {
    readonly id?: unknown;
  } | null;
  readonly seat?: unknown;
}

/**
 * Legacy bridge slot for VIMP raw events.
 *
 * Player lifecycle and stream events are handled by `VIMPPlayersManager`,
 * because it can resolve every native `vimp.players.Player` into the stable
 * Rock-Mod `VIMPPlayer` instance before emitting internal `rm::*` events.
 */
export class VIMPEventsBridge implements IEventsBridge {
  public constructor(private readonly _events: VIMPEventsManager) {}

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
    // Теперь это responsibility `VIMPPlayersManager`.
  }

  private _resolveVehicleEventPayload(payload: unknown): { vehicle: IVehicle; seat: number } | null {
    const vimpPayload = payload as IVIMPVehicleEventPayload | null;
    const vimpVehicleId = vimpPayload?.vehicle?.id;

    if (typeof vimpVehicleId !== "number" || !Number.isFinite(vimpVehicleId)) {
      return null;
    }

    const rawSeat = Number(vimpPayload?.seat);
    const seat = Number.isFinite(rawSeat) ? rawSeat : -1;

    try {
      const vehicle = RockMod.instance.vehicles.registerById(vimpVehicleId);
      return { vehicle, seat };
    } catch {
      return null;
    }
  }
}
