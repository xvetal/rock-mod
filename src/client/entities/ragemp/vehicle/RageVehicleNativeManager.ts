import { type IVehicleNativeManager } from "@RockMod/client/entities/common/vehicle/IVehicleNativeManager";

export class RageVehicleNativeManager implements IVehicleNativeManager {
  public getDisplayNameFromVehicleModel(modelHash: number): string {
    return mp.game.vehicle.getDisplayNameFromVehicleModel(modelHash);
  }
}
