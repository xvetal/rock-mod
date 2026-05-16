import { type IManagersFactory } from "../common/IManagersFactory";
import { CCMPNetManager } from "@RockMod/client/net/ccmp/CCMPNetManager";
import { CCMPBrowserManager } from "@RockMod/client/game/ccmp/browser/CCMPBrowserManager";
import { CCMPStorageManager } from "@RockMod/client/game/ccmp/storage/CCMPStorageManager";
import { CCMPKeysManager } from "@RockMod/client/game/ccmp/keys/CCMPKeysManager";
import { createNotImplementedProxy } from "./createNotImplementedProxy";

type ManagerReturn<K extends keyof IManagersFactory> = IManagersFactory[K] extends (...args: never[]) => infer R
  ? R
  : never;

export class CCMPManagersFactory implements IManagersFactory {
  public createNetManager(): ManagerReturn<"createNetManager"> {
    return new CCMPNetManager();
  }

  public createBlipsManager(): ManagerReturn<"createBlipsManager"> {
    return createNotImplementedProxy("CCMPBlipsManager");
  }

  public createColshapesManager(): ManagerReturn<"createColshapesManager"> {
    return createNotImplementedProxy("CCMPColshapesManager");
  }

  public createMarkersManager(): ManagerReturn<"createMarkersManager"> {
    return createNotImplementedProxy("CCMPMarkersManager");
  }

  public createObjectsManager(): ManagerReturn<"createObjectsManager"> {
    return createNotImplementedProxy("CCMPObjectsManager");
  }

  public createPedsManager(): ManagerReturn<"createPedsManager"> {
    return createNotImplementedProxy("CCMPPedsManager");
  }

  public createPlayersManager(): ManagerReturn<"createPlayersManager"> {
    return createNotImplementedProxy("CCMPPlayersManager");
  }

  public createUtilsManager(): ManagerReturn<"createUtilsManager"> {
    return createNotImplementedProxy("CCMPUtilsManager");
  }

  public createVehiclesManager(): ManagerReturn<"createVehiclesManager"> {
    return createNotImplementedProxy("CCMPVehiclesManager");
  }

  public createBrowserManager(): ManagerReturn<"createBrowserManager"> {
    return new CCMPBrowserManager();
  }

  public createChatManager(): ManagerReturn<"createChatManager"> {
    return createNotImplementedProxy("CCMPChatManager");
  }

  public createCursorManager(): ManagerReturn<"createCursorManager"> {
    return createNotImplementedProxy("CCMPCursorManager");
  }

  public createGuiManager(): ManagerReturn<"createGuiManager"> {
    return createNotImplementedProxy("CCMPGuiManager");
  }

  public createRaycastingManager(): ManagerReturn<"createRaycastingManager"> {
    return createNotImplementedProxy("CCMPRaycastingManager");
  }

  public createVoiceChatManager(): ManagerReturn<"createVoiceChatManager"> {
    return createNotImplementedProxy("CCMPVoiceChatManager");
  }

  public createCameraManager(): ManagerReturn<"createCameraManager"> {
    return createNotImplementedProxy("CCMPCameraManager");
  }

  public createStorageManager(): ManagerReturn<"createStorageManager"> {
    return new CCMPStorageManager();
  }

  public createGraphicsManager(): ManagerReturn<"createGraphicsManager"> {
    return createNotImplementedProxy("CCMPGraphicsManager");
  }

  public createNativeManager(): ManagerReturn<"createNativeManager"> {
    return createNotImplementedProxy("CCMPNativeCallerManager");
  }

  public createStreamingManager(): ManagerReturn<"createStreamingManager"> {
    return createNotImplementedProxy("CCMPStreamingManager");
  }

  public createLocalPlayerManager(): ManagerReturn<"createLocalPlayerManager"> {
    return createNotImplementedProxy("CCMPLocalPlayerManager");
  }

  public createControlsManager(): ManagerReturn<"createControlsManager"> {
    return createNotImplementedProxy("CCMPControlsManager");
  }

  public createKeysManager(): ManagerReturn<"createKeysManager"> {
    return new CCMPKeysManager();
  }

  public createGameplayManager(): ManagerReturn<"createGameplayManager"> {
    return createNotImplementedProxy("CCMPGameplayManager");
  }

  public createGameCameraManager(): ManagerReturn<"createGameCameraManager"> {
    return createNotImplementedProxy("CCMPGameCameraManager");
  }

  public createUiManager(): ManagerReturn<"createUiManager"> {
    return createNotImplementedProxy("CCMPUiManager");
  }

  public createNametagsManager(): ManagerReturn<"createNametagsManager"> {
    return createNotImplementedProxy("CCMPNametagsManager");
  }

  public createPathfindManager(): ManagerReturn<"createPathfindManager"> {
    return createNotImplementedProxy("CCMPPathfindManager");
  }

  public createZoneManager(): ManagerReturn<"createZoneManager"> {
    return createNotImplementedProxy("CCMPZoneManager");
  }

  public createWeaponManager(): ManagerReturn<"createWeaponManager"> {
    return createNotImplementedProxy("CCMPWeaponManager");
  }

  public createGameObjectManager(): ManagerReturn<"createGameObjectManager"> {
    return createNotImplementedProxy("CCMPGameObjectManager");
  }

  public createConsoleManager(): ManagerReturn<"createConsoleManager"> {
    return createNotImplementedProxy("CCMPConsoleManager");
  }
}
