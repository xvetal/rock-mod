import { INetManager } from "../../net/common/INetManager";
import { IObjectsManager, IPedsManager, IPlayersManager, IVehiclesManager } from "../../entities";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createObjectsManager(): IObjectsManager;
  createPedsManager(): IPedsManager;
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
