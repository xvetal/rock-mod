import { type IManagersFactory } from "../common/IManagersFactory";
import { VIMPNetManager } from "@RockMod/client/net/vimp/VIMPNetManager";
import { VIMPBrowserManager } from "@RockMod/client/game/vimp/browser/VIMPBrowserManager";
import { VIMPStorageManager } from "@RockMod/client/game/vimp/storage/VIMPStorageManager";
import { VIMPKeysManager } from "@RockMod/client/game/vimp/keys/VIMPKeysManager";
import { VIMPNametagsManager } from "@RockMod/client/game/vimp/nametags/VIMPNametagsManager";
import { VIMPChatManager } from "@RockMod/client/game/vimp/chat/VIMPChatManager";
import { VIMPControlsManager } from "@RockMod/client/game/vimp/controls/VIMPControlsManager";
import { VIMPPlayersManager } from "@RockMod/client/entities/vimp/player/VIMPPlayersManager";
import { VIMPPedsManager } from "@RockMod/client/entities/vimp/ped/VIMPPedsManager";
import { VIMPVehiclesManager } from "@RockMod/client/entities/vimp/vehicle/VIMPVehiclesManager";
import { VIMPObjectsManager } from "@RockMod/client/entities/vimp/object/VIMPObjectsManager";
import { VIMPMarkersManager } from "@RockMod/client/entities/vimp/marker/VIMPMarkersManager";
import { VIMPBlipsManager } from "@RockMod/client/entities/vimp/blip/VIMPBlipsManager";
import { VIMPColshapesManager } from "@RockMod/client/entities/vimp/colshape/VIMPColshapesManager";
import { VIMPUtilsManager } from "@RockMod/client/utils/vimp/VIMPUtilsManager";
import { VIMPGraphicsManager } from "@RockMod/client/game/vimp/graphics/VIMPGraphicsManager";
import { VIMPUiManager } from "@RockMod/client/game/vimp/ui/VIMPUiManager";
import { VIMPPathfindManager } from "@RockMod/client/game/vimp/pathfind/VIMPPathfindManager";
import { VIMPZoneManager } from "@RockMod/client/game/vimp/zone/VIMPZoneManager";
import { VIMPNativeCallerManager } from "@RockMod/client/game/vimp/native/VIMPNativeCallerManager";
import { VIMPGuiManager } from "@RockMod/client/game/vimp/gui/VIMPGuiManager";
import { VIMPRaycastingManager } from "@RockMod/client/game/vimp/raycasting/VIMPRaycastingManager";
import { VIMPSyncedMetaBridge } from "@RockMod/client/net/vimp/events/VIMPSyncedMetaBridge";
import { VIMPCameraManager } from "@RockMod/client/entities/vimp/camera/VIMPCameraManager";
import { VIMPStreamingManager } from "@RockMod/client/game/vimp/streaming/VIMPStreamingManager";
import { VIMPCursorManager } from "@RockMod/client/game/vimp/cursor/VIMPCursorManager";
import { VIMPGameObjectManager } from "@RockMod/client/game/vimp/object/VIMPGameObjectManager";
import { VIMPGameplayManager } from "@RockMod/client/game/vimp/gameplay/VIMPGameplayManager";
import { VIMPWeaponManager } from "@RockMod/client/game/vimp/weapon/VIMPWeaponManager";
import { VIMPVoiceChatManager } from "@RockMod/client/game/vimp/voiceChat/VIMPVoiceChatManager";
import { createNotImplementedProxy } from "./createNotImplementedProxy";

type ManagerReturn<K extends keyof IManagersFactory> = IManagersFactory[K] extends (...args: never[]) => infer R
  ? R
  : never;

export class VIMPManagersFactory implements IManagersFactory {
  private _netManager: VIMPNetManager | null = null;

  private _blipsManager: VIMPBlipsManager | null = null;

  private _colshapesManager: VIMPColshapesManager | null = null;

  private _markersManager: VIMPMarkersManager | null = null;

  private _objectsManager: VIMPObjectsManager | null = null;

  private _pedsManager: VIMPPedsManager | null = null;

  private _playersManager: VIMPPlayersManager | null = null;

  private _vehiclesManager: VIMPVehiclesManager | null = null;

  private _syncedMetaBridgeRegistered = false;

  public createNetManager(): ManagerReturn<"createNetManager"> {
    this._netManager = new VIMPNetManager();
    return this._netManager;
  }

  private _requireNetManager(forMethod: string): VIMPNetManager {
    if (!this._netManager) {
      throw new Error(
        `VIMPManagersFactory.${forMethod}: ` +
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

    new VIMPSyncedMetaBridge(this._netManager.events, {
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
    this._blipsManager = new VIMPBlipsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._blipsManager;
  }

  public createColshapesManager(): ManagerReturn<"createColshapesManager"> {
    const netManager = this._requireNetManager("createColshapesManager");
    this._colshapesManager = new VIMPColshapesManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._colshapesManager;
  }

  public createMarkersManager(): ManagerReturn<"createMarkersManager"> {
    const netManager = this._requireNetManager("createMarkersManager");
    this._markersManager = new VIMPMarkersManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._markersManager;
  }

  public createObjectsManager(): ManagerReturn<"createObjectsManager"> {
    const netManager = this._requireNetManager("createObjectsManager");
    this._objectsManager = new VIMPObjectsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._objectsManager;
  }

  public createPedsManager(): ManagerReturn<"createPedsManager"> {
    const netManager = this._requireNetManager("createPedsManager");
    this._pedsManager = new VIMPPedsManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._pedsManager;
  }

  public createPlayersManager(): ManagerReturn<"createPlayersManager"> {
    const netManager = this._requireNetManager("createPlayersManager");
    this._playersManager = new VIMPPlayersManager(netManager.events);
    this._registerSyncedMetaBridgeIfReady();
    return this._playersManager;
  }

  public createUtilsManager(): ManagerReturn<"createUtilsManager"> {
    return new VIMPUtilsManager();
  }

  public createVehiclesManager(): ManagerReturn<"createVehiclesManager"> {
    this._vehiclesManager = new VIMPVehiclesManager();
    this._registerSyncedMetaBridgeIfReady();
    return this._vehiclesManager;
  }

  public createBrowserManager(): ManagerReturn<"createBrowserManager"> {
    return new VIMPBrowserManager();
  }

  public createChatManager(): ManagerReturn<"createChatManager"> {
    return new VIMPChatManager();
  }

  public createCursorManager(): ManagerReturn<"createCursorManager"> {
    return new VIMPCursorManager();
  }

  public createGuiManager(): ManagerReturn<"createGuiManager"> {
    return new VIMPGuiManager();
  }

  public createRaycastingManager(): ManagerReturn<"createRaycastingManager"> {
    return new VIMPRaycastingManager();
  }

  public createVoiceChatManager(): ManagerReturn<"createVoiceChatManager"> {
    return new VIMPVoiceChatManager();
  }

  public createCameraManager(): ManagerReturn<"createCameraManager"> {
    return new VIMPCameraManager();
  }

  public createStorageManager(): ManagerReturn<"createStorageManager"> {
    return new VIMPStorageManager();
  }

  public createGraphicsManager(): ManagerReturn<"createGraphicsManager"> {
    return new VIMPGraphicsManager();
  }

  public createNativeManager(): ManagerReturn<"createNativeManager"> {
    return new VIMPNativeCallerManager();
  }

  public createStreamingManager(): ManagerReturn<"createStreamingManager"> {
    return new VIMPStreamingManager();
  }

  public createLocalPlayerManager(): ManagerReturn<"createLocalPlayerManager"> {
    return createNotImplementedProxy("VIMPLocalPlayerManager");
  }

  public createControlsManager(): ManagerReturn<"createControlsManager"> {
    return new VIMPControlsManager();
  }

  public createKeysManager(): ManagerReturn<"createKeysManager"> {
    return new VIMPKeysManager();
  }

  public createGameplayManager(): ManagerReturn<"createGameplayManager"> {
    return new VIMPGameplayManager();
  }

  public createGameCameraManager(): ManagerReturn<"createGameCameraManager"> {
    return createNotImplementedProxy("VIMPGameCameraManager");
  }

  public createUiManager(): ManagerReturn<"createUiManager"> {
    return new VIMPUiManager();
  }

  public createNametagsManager(): ManagerReturn<"createNametagsManager"> {
    return new VIMPNametagsManager();
  }

  public createPathfindManager(): ManagerReturn<"createPathfindManager"> {
    return new VIMPPathfindManager();
  }

  public createZoneManager(): ManagerReturn<"createZoneManager"> {
    return new VIMPZoneManager();
  }

  public createWeaponManager(): ManagerReturn<"createWeaponManager"> {
    return new VIMPWeaponManager();
  }

  public createGameObjectManager(): ManagerReturn<"createGameObjectManager"> {
    return new VIMPGameObjectManager();
  }

  public createConsoleManager(): ManagerReturn<"createConsoleManager"> {
    return createNotImplementedProxy("VIMPConsoleManager");
  }
}
