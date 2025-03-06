import { type INetManager } from "../../net/common/INetManager";
import {
  type IBlipsManager,
  type IColshapesManager,
  type IMarkersManager,
  type IObjectsManager,
  type IPedsManager,
  type IPlayersManager,
  type IVehiclesManager,
} from "../../entities";
import { type IUtilsManager } from "../../utils";
import { type IWorldManager } from "../../world";

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
  createWorldManager(): IWorldManager;
}
