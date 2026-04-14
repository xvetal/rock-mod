import { type INetManager } from "../../net/common/INetManager";
import {
  type IBlipsManager,
  type ICameraManager,
  type IColshapesManager,
  type IMarkersManager,
  type IObjectsManager,
  type IPedsManager,
  type IPlayersManager,
  type IVehiclesManager,
} from "../../entities";
import { type IUtilsManager } from "../../utils";
import {
  type IBrowserManager,
  type IGraphicsManager,
  type INativeCallerManager,
  type IStorageManager,
} from "@RockMod/client/game";

export interface IManagersFactory {
  createNetManager(): INetManager;
  createBlipsManager(): IBlipsManager;
  createColshapesManager(): IColshapesManager;
  createMarkersManager(): IMarkersManager;
  createObjectsManager(): IObjectsManager;
  createPedsManager(): IPedsManager;
  createPlayersManager(): IPlayersManager;
  createUtilsManager(): IUtilsManager;
  createVehiclesManager(): IVehiclesManager;
  createBrowserManager(): IBrowserManager;
  createCameraManager(): ICameraManager;
  createStorageManager(): IStorageManager;
  createGraphicsManager(): IGraphicsManager;
  createNativeManager(): INativeCallerManager;
}
