import { type IManagersFactory } from "../common/IManagersFactory";
import { CCMPNetManager } from "@RockMod/client/net/ccmp/CCMPNetManager";
import { CCMPBrowserManager } from "@RockMod/client/game/ccmp/browser/CCMPBrowserManager";
import { CCMPStorageManager } from "@RockMod/client/game/ccmp/storage/CCMPStorageManager";
import { CCMPKeysManager } from "@RockMod/client/game/ccmp/keys/CCMPKeysManager";
import { CCMPNametagsManager } from "@RockMod/client/game/ccmp/nametags/CCMPNametagsManager";
import { CCMPChatManager } from "@RockMod/client/game/ccmp/chat/CCMPChatManager";
import { CCMPControlsManager } from "@RockMod/client/game/ccmp/controls/CCMPControlsManager";
import { CCMPPlayersManager } from "@RockMod/client/entities/ccmp/player/CCMPPlayersManager";
import { CCMPPedsManager } from "@RockMod/client/entities/ccmp/ped/CCMPPedsManager";
import { CCMPUtilsManager } from "@RockMod/client/utils/ccmp/CCMPUtilsManager";
import { CCMPGraphicsManager } from "@RockMod/client/game/ccmp/graphics/CCMPGraphicsManager";
import { CCMPUiManager } from "@RockMod/client/game/ccmp/ui/CCMPUiManager";
import { createNotImplementedProxy } from "./createNotImplementedProxy";

type ManagerReturn<K extends keyof IManagersFactory> = IManagersFactory[K] extends (...args: never[]) => infer R
  ? R
  : never;

export class CCMPManagersFactory implements IManagersFactory {
  /**
   * Сохраняем созданный `CCMPNetManager` потому что другим менеджерам
   * (например, `CCMPPlayersManager`) нужен доступ к его событиям. Порядок
   * создания в `RockMod` гарантирует, что `createNetManager` вызывается
   * первым — мы можем безопасно полагаться на наличие `_netManager` в
   * последующих фабричных методах.
   */
  private _netManager: CCMPNetManager | null = null;

  public createNetManager(): ManagerReturn<"createNetManager"> {
    this._netManager = new CCMPNetManager();
    return this._netManager;
  }

  private _requireNetManager(forMethod: string): CCMPNetManager {
    if (!this._netManager) {
      throw new Error(
        `CCMPManagersFactory.${forMethod}: ` +
          "createNetManager() ещё не вызывался. Это нарушение контракта порядка " +
          "фабричных методов в RockMod-конструкторе.",
      );
    }
    return this._netManager;
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
    return new CCMPPedsManager();
  }

  public createPlayersManager(): ManagerReturn<"createPlayersManager"> {
    const netManager = this._requireNetManager("createPlayersManager");
    return new CCMPPlayersManager(netManager.events);
  }

  public createUtilsManager(): ManagerReturn<"createUtilsManager"> {
    return new CCMPUtilsManager();
  }

  public createVehiclesManager(): ManagerReturn<"createVehiclesManager"> {
    return createNotImplementedProxy("CCMPVehiclesManager");
  }

  public createBrowserManager(): ManagerReturn<"createBrowserManager"> {
    return new CCMPBrowserManager();
  }

  public createChatManager(): ManagerReturn<"createChatManager"> {
    return new CCMPChatManager();
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
    return new CCMPGraphicsManager();
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
    return new CCMPControlsManager();
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
    return new CCMPUiManager();
  }

  public createNametagsManager(): ManagerReturn<"createNametagsManager"> {
    return new CCMPNametagsManager();
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
