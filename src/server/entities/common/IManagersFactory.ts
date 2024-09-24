import { IPlayersManager } from "./player/IPlayersManager";
import { IVehiclesManager } from "./vehicle/IVehiclesManager";

export interface IManagersFactory {
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
