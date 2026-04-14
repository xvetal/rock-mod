import { type INetManager } from "../../net/common/INetManager";
import {
  type IBlipsManager,
  type ICameraManager,
  type IColshapesManager,
  type IMarkersManager,
  type IObjectsManager,
  type IPedsManager,
  type IPlayersManager,
  type IVehicleNativeManager,
  type IVehiclesManager,
} from "../../entities";
import { type IUtilsManager } from "../../utils";
import { type IBrowserManager, type IStorageManager } from "@RockMod/client/game";

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
  createVehicleNativeManager(): IVehicleNativeManager;
  createBrowserManager(): IBrowserManager;
  createCameraManager(): ICameraManager;
  createStorageManager(): IStorageManager;
}
