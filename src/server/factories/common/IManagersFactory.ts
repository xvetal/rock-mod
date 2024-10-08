import { INetManager } from "../../net/common/INetManager";
import {
  IBlipsManager,
  IMarkersManager,
  IObjectsManager,
  IPedsManager,
  IPlayersManager,
  IVehiclesManager,
} from "../../entities";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createBlipsManager(): IBlipsManager;
  createMarkersManager(): IMarkersManager;
  createObjectsManager(): IObjectsManager;
  createPedsManager(): IPedsManager;
  createPlayersManager(): IPlayersManager;
  createVehiclesManager(): IVehiclesManager;
}
