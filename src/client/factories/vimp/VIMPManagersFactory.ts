import { type IManagersFactory } from "../common/IManagersFactory";
import { CCMPNetManager } from "@RockMod/client/net/vimp/VIMPNetManager";
import { CCMPBrowserManager } from "@RockMod/client/game/vimp/browser/VIMPBrowserManager";
import { CCMPStorageManager } from "@RockMod/client/game/vimp/storage/VIMPStorageManager";
import { CCMPKeysManager } from "@RockMod/client/game/vimp/keys/VIMPKeysManager";
import { CCMPNametagsManager } from "@RockMod/client/game/vimp/nametags/VIMPNametagsManager";
import { CCMPChatManager } from "@RockMod/client/game/vimp/chat/VIMPChatManager";
import { CCMPControlsManager } from "@RockMod/client/game/vimp/controls/VIMPControlsManager";
import { CCMPPlayersManager } from "@RockMod/client/entities/vimp/player/VIMPPlayersManager";
import { CCMPPedsManager } from "@RockMod/client/entities/vimp/ped/VIMPPedsManager";
import { CCMPVehiclesManager } from "@RockMod/client/entities/vimp/vehicle/VIMPVehiclesManager";
import { CCMPObjectsManager } from "@RockMod/client/entities/vimp/object/VIMPObjectsManager";
import { CCMPMarkersManager } from "@RockMod/client/entities/vimp/marker/VIMPMarkersManager";
import { CCMPBlipsManager } from "@RockMod/client/entities/vimp/blip/VIMPBlipsManager";
import { CCMPColshapesManager } from "@RockMod/client/entities/vimp/colshape/VIMPColshapesManager";
import { CCMPUtilsManager } from "@RockMod/client/utils/vimp/VIMPUtilsManager";
import { CCMPGraphicsManager } from "@RockMod/client/game/vimp/graphics/VIMPGraphicsManager";
import { CCMPUiManager } from "@RockMod/client/game/vimp/ui/VIMPUiManager";
import { CCMPPathfindManager } from "@RockMod/client/game/vimp/pathfind/VIMPPathfindManager";
import { CCMPZoneManager } from "@RockMod/client/game/vimp/zone/VIMPZoneManager";
import { CCMPNativeCallerManager } from "@RockMod/client/game/vimp/native/VIMPNativeCallerManager";
import { CCMPGuiManager } from "@RockMod/client/game/vimp/gui/VIMPGuiManager";
import { CCMPRaycastingManager } from "@RockMod/client/game/vimp/raycasting/VIMPRaycastingManager";
import { CCMPSyncedMetaBridge } from "@RockMod/client/net/vimp/events/VIMPSyncedMetaBridge";
import { CCMPCameraManager } from "@RockMod/client/entities/vimp/camera/VIMPCameraManager";
import { CCMPStreamingManager } from "@RockMod/client/game/vimp/streaming/VIMPStreamingManager";
import { CCMPCursorManager } from "@RockMod/client/game/vimp/cursor/VIMPCursorManager";
import { CCMPGameObjectManager } from "@RockMod/client/game/vimp/object/VIMPGameObjectManager";
import { CCMPGameplayManager } from "@RockMod/client/game/vimp/gameplay/VIMPGameplayManager";
import { CCMPWeaponManager } from "@RockMod/client/game/vimp/weapon/VIMPWeaponManager";
import { CCMPVoiceChatManager } from "@RockMod/client/game/vimp/voiceChat/VIMPVoiceChatManager";
import { createNotImplementedProxy } from "./createNotImplementedProxy";

type ManagerReturn<K extends keyof IManagersFactory> = IManagersFactory[K] extends (...args: never[]) => infer R
  ? R
  : never;

export class CCMPManagersFactory implements IManagersFactory {
  private _netManager: CCMPNetManager | null = null;

  private _blipsManager: CCMPBlipsManager | null = null;

  private _colshapesManager: CCMPColshapesManager | null = null;

  private _markersManager: CCMPMarkersManager | null = null;

  private _objectsManager: CCMPObjectsManager | null = null;

  private _pedsManager: CCMPPedsManager | null = null;

  private _playersManager: CCMPPlayersManager | null = null;

  private _vehiclesManager: CCMPVehiclesManager | null = null;

  private _syncedMetaBridgeRegistered = false;

  public createNetManager(): ManagerReturn<"createNetManager"> {
    this._netManager = new CCMPNetManager();
    return this._netManager;
  }

  private _requireNetManager(forMethod: string): CCMPNetManager {
    if (!this._netManager) {
      throw new Error(
        `CCMPManagersFactory.${forMethod}: ` +
          "createNetManager() was not called yet. This violates RockMod manager factory order.",
      );
    }
    return this._netManager;
  }

  private _registerSyncedMetaBridgeIfReady(): void {
    if (
      this._syncedMetaBridgeRegistered ||
      !this._netManager ||
      !this._blipsManager ||
      !this._colshapesManager ||
      !this._markersManager ||
      !this._objectsManager ||
      !this._pedsManager ||
      !this._playersManager ||
      !this._vehiclesManager
    ) {
      return;
    }

    new CCMPSyncedMetaBridge(this._netManager.events, {
      blips: this._blipsManager,
      colshapes: this._colshapesManager,
      markers: this._markersManager,
      objects: this._objectsManager,
      peds: this._pedsManager,
      players: this._playersManager,
      vehicles: this._vehiclesManager,
    }).register();

    this._syncedMetaBridgeRegistered = true;
  }

  public createBlipsManager(): ManagerReturn<"createBlipsManager"> {
    const netManager = this._requireNetManager("createBlipsManager");
    this._blipsManager = new CCMPBlipsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._blipsManager;
  }

  public createColshapesManager(): ManagerReturn<"createColshapesManager"> {
    const netManager = this._requireNetManager("createColshapesManager");
    this._colshapesManager = new CCMPColshapesManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._colshapesManager;
  }

  public createMarkersManager(): ManagerReturn<"createMarkersManager"> {
    const netManager = this._requireNetManager("createMarkersManager");
    this._markersManager = new CCMPMarkersManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._markersManager;
  }

  public createObjectsManager(): ManagerReturn<"createObjectsManager"> {
    const netManager = this._requireNetManager("createObjectsManager");
    this._objectsManager = new CCMPObjectsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._objectsManager;
  }

  public createPedsManager(): ManagerReturn<"createPedsManager"> {
    const netManager = this._requireNetManager("createPedsManager");
    this._pedsManager = new CCMPPedsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._pedsManager;
  }

  public createPlayersManager(): ManagerReturn<"createPlayersManager"> {
    const netManager = this._requireNetManager("createPlayersManager");
    this._playersManager = new CCMPPlayersManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._playersManager;
  }

  public createUtilsManager(): ManagerReturn<"createUtilsManager"> {
    return new CCMPUtilsManager();
  }

  public createVehiclesManager(): ManagerReturn<"createVehiclesManager"> {
    this._vehiclesManager = new CCMPVehiclesManager();
    this._registerSyncedMetaBridgeIfReady();
    return this._vehiclesManager;
  }

  public createBrowserManager(): ManagerReturn<"createBrowserManager"> {
    return new CCMPBrowserManager();
  }

  public createChatManager(): ManagerReturn<"createChatManager"> {
    return new CCMPChatManager();
  }

  public createCursorManager(): ManagerReturn<"createCursorManager"> {
    return new CCMPCursorManager();
  }

  public createGuiManager(): ManagerReturn<"createGuiManager"> {
    return new CCMPGuiManager();
  }

  public createRaycastingManager(): ManagerReturn<"createRaycastingManager"> {
    return new CCMPRaycastingManager();
  }

  public createVoiceChatManager(): ManagerReturn<"createVoiceChatManager"> {
    return new CCMPVoiceChatManager();
  }

  public createCameraManager(): ManagerReturn<"createCameraManager"> {
    return new CCMPCameraManager();
  }

  public createStorageManager(): ManagerReturn<"createStorageManager"> {
    return new CCMPStorageManager();
  }

  public createGraphicsManager(): ManagerReturn<"createGraphicsManager"> {
    return new CCMPGraphicsManager();
  }

  public createNativeManager(): ManagerReturn<"createNativeManager"> {
    return new CCMPNativeCallerManager();
  }

  public createStreamingManager(): ManagerReturn<"createStreamingManager"> {
    return new CCMPStreamingManager();
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
    return new CCMPGameplayManager();
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
    return new CCMPPathfindManager();
  }

  public createZoneManager(): ManagerReturn<"createZoneManager"> {
    return new CCMPZoneManager();
  }

  public createWeaponManager(): ManagerReturn<"createWeaponManager"> {
    return new CCMPWeaponManager();
  }

  public createGameObjectManager(): ManagerReturn<"createGameObjectManager"> {
    return new CCMPGameObjectManager();
  }

  public createConsoleManager(): ManagerReturn<"createConsoleManager"> {
    return createNotImplementedProxy("CCMPConsoleManager");
  }
}
