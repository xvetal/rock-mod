import { type IManagersFactory } from "../common/IManagersFactory";
import { RockSandboxNetManager } from "../../net/rock-sandbox/RockSandboxNetManager";
import { RockSandboxBlipsManager } from "../../entities/rock-sandbox/blip/RockSandboxBlipsManager";
import { RockSandboxColshapesManager } from "../../entities/rock-sandbox/colshape/RockSandboxColshapesManager";
import { RockSandboxMarkersManager } from "../../entities/rock-sandbox/marker/RockSandboxMarkersManager";
import { RockSandboxObjectsManager } from "../../entities/rock-sandbox/object/RockSandboxObjectsManager";
import { RockSandboxPedsManager } from "../../entities/rock-sandbox/ped/RockSandboxPedsManager";
import { RockSandboxPlayersManager } from "../../entities/rock-sandbox/player/RockSandboxPlayersManager";
import { RockSandboxUtilsManager } from "../../utils/rock-sandbox/RockSandboxUtilsManager";
import { RockSandboxVehiclesManager } from "../../entities/rock-sandbox/vehicle/RockSandboxVehiclesManager";
import { RockSandboxBrowserManager } from "../../game/rock-sandbox/browser/RockSandboxBrowserManager";
import { RockSandboxChatManager } from "../../game/rock-sandbox/chat/RockSandboxChatManager";
import { RockSandboxCursorManager } from "../../game/rock-sandbox/cursor/RockSandboxCursorManager";
import { RockSandboxGuiManager } from "../../game/rock-sandbox/gui/RockSandboxGuiManager";
import { RockSandboxRaycastingManager } from "../../game/rock-sandbox/raycasting/RockSandboxRaycastingManager";
import { RockSandboxVoiceChatManager } from "../../game/rock-sandbox/voiceChat/RockSandboxVoiceChatManager";
import { RockSandboxCameraManager } from "../../entities/rock-sandbox/camera/RockSandboxCameraManager";
import { RockSandboxStorageManager } from "../../game/rock-sandbox/storage/RockSandboxStorageManager";
import { RockSandboxGraphicsManager } from "../../game/rock-sandbox/graphics/RockSandboxGraphicsManager";
import { RockSandboxNativeCallerManager } from "../../game/rock-sandbox/native/RockSandboxNativeCallerManager";
import { RockSandboxStreamingManager } from "../../game/rock-sandbox/streaming/RockSandboxStreamingManager";
import { RockSandboxLocalPlayerManager } from "../../game/rock-sandbox/localPlayer/RockSandboxLocalPlayerManager";
import { RockSandboxControlsManager } from "../../game/rock-sandbox/controls/RockSandboxControlsManager";
import { RockSandboxKeysManager } from "../../game/rock-sandbox/keys/RockSandboxKeysManager";
import { RockSandboxGameplayManager } from "../../game/rock-sandbox/gameplay/RockSandboxGameplayManager";
import { RockSandboxGameCameraManager } from "../../game/rock-sandbox/camera/RockSandboxGameCameraManager";
import { RockSandboxUiManager } from "../../game/rock-sandbox/ui/RockSandboxUiManager";
import { RockSandboxNametagsManager } from "../../game/rock-sandbox/nametags/RockSandboxNametagsManager";
import { RockSandboxPathfindManager } from "../../game/rock-sandbox/pathfind/RockSandboxPathfindManager";
import { RockSandboxZoneManager } from "../../game/rock-sandbox/zone/RockSandboxZoneManager";
import { RockSandboxWeaponManager } from "../../game/rock-sandbox/weapon/RockSandboxWeaponManager";
import { RockSandboxGameObjectManager } from "../../game/rock-sandbox/object/RockSandboxGameObjectManager";
import { RockSandboxConsoleManager } from "../../console/rock-sandbox/RockSandboxConsoleManager";

export class RockSandboxManagersFactory implements IManagersFactory {
  public createNetManager(): RockSandboxNetManager {
    return new RockSandboxNetManager();
  }

  public createBlipsManager(): RockSandboxBlipsManager {
    return new RockSandboxBlipsManager();
  }

  public createColshapesManager(): RockSandboxColshapesManager {
    return new RockSandboxColshapesManager();
  }

  public createMarkersManager(): RockSandboxMarkersManager {
    return new RockSandboxMarkersManager();
  }

  public createObjectsManager(): RockSandboxObjectsManager {
    return new RockSandboxObjectsManager();
  }

  public createPedsManager(): RockSandboxPedsManager {
    return new RockSandboxPedsManager();
  }

  public createPlayersManager(): RockSandboxPlayersManager {
    return new RockSandboxPlayersManager();
  }

  public createUtilsManager(): RockSandboxUtilsManager {
    return new RockSandboxUtilsManager();
  }

  public createVehiclesManager(): RockSandboxVehiclesManager {
    return new RockSandboxVehiclesManager();
  }

  public createBrowserManager(): RockSandboxBrowserManager {
    return new RockSandboxBrowserManager();
  }

  public createChatManager(): RockSandboxChatManager {
    return new RockSandboxChatManager();
  }

  public createCursorManager(): RockSandboxCursorManager {
    return new RockSandboxCursorManager();
  }

  public createGuiManager(): RockSandboxGuiManager {
    return new RockSandboxGuiManager();
  }

  public createRaycastingManager(): RockSandboxRaycastingManager {
    return new RockSandboxRaycastingManager();
  }

  public createVoiceChatManager(): RockSandboxVoiceChatManager {
    return new RockSandboxVoiceChatManager();
  }

  public createCameraManager(): RockSandboxCameraManager {
    return new RockSandboxCameraManager();
  }

  public createStorageManager(): RockSandboxStorageManager {
    return new RockSandboxStorageManager();
  }

  public createGraphicsManager(): RockSandboxGraphicsManager {
    return new RockSandboxGraphicsManager();
  }

  public createNativeManager(): RockSandboxNativeCallerManager {
    return new RockSandboxNativeCallerManager();
  }

  public createStreamingManager(): RockSandboxStreamingManager {
    return new RockSandboxStreamingManager();
  }

  public createLocalPlayerManager(): RockSandboxLocalPlayerManager {
    return new RockSandboxLocalPlayerManager();
  }

  public createControlsManager(): RockSandboxControlsManager {
    return new RockSandboxControlsManager();
  }

  public createKeysManager(): RockSandboxKeysManager {
    return new RockSandboxKeysManager();
  }

  public createGameplayManager(): RockSandboxGameplayManager {
    return new RockSandboxGameplayManager();
  }

  public createGameCameraManager(): RockSandboxGameCameraManager {
    return new RockSandboxGameCameraManager();
  }

  public createUiManager(): RockSandboxUiManager {
    return new RockSandboxUiManager();
  }

  public createNametagsManager(): RockSandboxNametagsManager {
    return new RockSandboxNametagsManager();
  }

  public createPathfindManager(): RockSandboxPathfindManager {
    return new RockSandboxPathfindManager();
  }

  public createZoneManager(): RockSandboxZoneManager {
    return new RockSandboxZoneManager();
  }

  public createWeaponManager(): RockSandboxWeaponManager {
    return new RockSandboxWeaponManager();
  }

  public createGameObjectManager(): RockSandboxGameObjectManager {
    return new RockSandboxGameObjectManager();
  }

  public createConsoleManager(): RockSandboxConsoleManager {
    return new RockSandboxConsoleManager();
  }
}
