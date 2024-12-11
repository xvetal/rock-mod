import { INetManager } from "../../net/common/INetManager";
import {
  IBlipsManager,
  IColshapesManager,
  IMarkersManager,
  IObjectsManager,
  IPedsManager,
  IPlayersManager,
  IVehiclesManager,
} from "../../entities";
import { IUtilsManager } from "../../utils";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createBlipsManager(): IBlipsManager;
  createColshapesManager(): IColshapesManager;
  createMarkersManager(): IMarkersManager;
  createObjectsManager(): IObjectsManager;
  createPedsManager(): IPedsManager;
  createPlayersManager(net: INetManager): IPlayersManager;
  createUtilsManager(): IUtilsManager;
  createVehiclesManager(): IVehiclesManager;
}
