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
  type IChatManager,
  type IControlsManager,
  type ICursorManager,
  type IGameCameraManager,
  type IGameplayManager,
  type IRaycastingManager,
  type IGraphicsManager,
  type IGuiManager,
  type IKeysManager,
  type ILocalPlayerManager,
  type INametagsManager,
  type INativeCallerManager,
  type IGameObjectManager,
  type IPathfindManager,
  type IStorageManager,
  type IStreamingManager,
  type IUiManager,
  type IVoiceChatManager,
  type IWeaponManager,
  type IZoneManager,
} from "@RockMod/client/game";
import { type IConsoleManager } from "@RockMod/client/console";

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
  createChatManager(): IChatManager;
  createCursorManager(): ICursorManager;
  createGuiManager(): IGuiManager;
  createRaycastingManager(): IRaycastingManager;
  createVoiceChatManager(): IVoiceChatManager;
  createCameraManager(): ICameraManager;
  createStorageManager(): IStorageManager;
  createGraphicsManager(): IGraphicsManager;
  createNativeManager(): INativeCallerManager;
  createStreamingManager(): IStreamingManager;
  createLocalPlayerManager(): ILocalPlayerManager;
  createControlsManager(): IControlsManager;
  createKeysManager(): IKeysManager;
  createGameplayManager(): IGameplayManager;
  createGameCameraManager(): IGameCameraManager;
  createUiManager(): IUiManager;
  createNametagsManager(): INametagsManager;
  createPathfindManager(): IPathfindManager;
  createZoneManager(): IZoneManager;
  createWeaponManager(): IWeaponManager;
  createGameObjectManager(): IGameObjectManager;
  createConsoleManager(): IConsoleManager;
}
