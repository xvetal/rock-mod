import { INetManager } from "../../net/common/INetManager";
import { IBlipsManager, IObjectsManager, IPedsManager, IPlayersManager, IVehiclesManager } from "../../entities";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createBlipsManager(): IBlipsManager;
  createObjectsManager(): IObjectsManager;
  createPedsManager(): IPedsManager;
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
