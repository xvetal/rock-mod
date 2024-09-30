import { INetManager } from "../../net/common/INetManager";
import { IPlayersManager } from "./player/IPlayersManager";
import { IVehiclesManager } from "./vehicle/IVehiclesManager";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createPlayersManager(net: INetManager): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
