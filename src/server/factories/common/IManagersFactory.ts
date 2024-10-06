import { INetManager } from "../../net/common/INetManager";
import { IObjectsManager, IPlayersManager, IVehiclesManager } from "../../entities";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createObjectsManager(): IObjectsManager;
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
