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
  type IControlsManager,
  type IGameplayManager,
  type IGraphicsManager,
  type IKeysManager,
  type ILocalPlayerManager,
  type INametagsManager,
  type INativeCallerManager,
  type IPathfindManager,
  type IStorageManager,
  type IStreamingManager,
  type IUiManager,
  type IZoneManager,
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
  createStreamingManager(): IStreamingManager;
  createLocalPlayerManager(): ILocalPlayerManager;
  createControlsManager(): IControlsManager;
  createKeysManager(): IKeysManager;
  createGameplayManager(): IGameplayManager;
  createUiManager(): IUiManager;
  createNametagsManager(): INametagsManager;
  createPathfindManager(): IPathfindManager;
  createZoneManager(): IZoneManager;
}
