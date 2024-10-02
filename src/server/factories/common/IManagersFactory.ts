import { INetManager } from "../../net/common/INetManager";
import { IPlayersManager } from "../../entities/common/player/IPlayersManager";
import { IVehiclesManager } from "../../entities/common/vehicle/IVehiclesManager";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
