import { type IManagersFactory } from "../common/IManagersFactory";
import { RageBlipsManager } from "@RockMod/client/entities/ragemp/blip/RageBlipsManager";
import { RageColshapesManager } from "@RockMod/client/entities/ragemp/colshape/RageColshapesManager";
import { RageMarkersManager } from "@RockMod/client/entities/ragemp/marker/RageMarkersManager";
import { RageObjectsManager } from "@RockMod/client/entities/ragemp/object/RageObjectsManager";
import { RagePedsManager } from "@RockMod/client/entities/ragemp/ped/RagePedsManager";
import { RagePlayersManager } from "@RockMod/client/entities/ragemp/player/RagePlayersManager";
import { RageVehiclesManager } from "@RockMod/client/entities/ragemp/vehicle/RageVehiclesManager";
import { RageNetManager } from "@RockMod/client/net/ragemp/RageNetManager";
import { RageUtilsManager } from "@RockMod/client/utils/ragemp/RageUtilsManager";
import { RageBrowserManager } from "@RockMod/client/game/ragemp/browser/RageBrowserManager";
import { RageCameraManager } from "@RockMod/client/entities/ragemp/camera/RageCameraManager";
import { RageStorageManager } from "@RockMod/client/game/ragemp/storage/RageStorageManager";
import { RageGraphicsManager } from "@RockMod/client/game/ragemp/graphics/RageGraphicsManager";
import { RageNativeCallerManager } from "@RockMod/client/game/ragemp/native/RageNativeCallerManager";
import { RageStreamingManager } from "@RockMod/client/game/ragemp/streaming/RageStreamingManager";
import { RageLocalPlayerManager } from "@RockMod/client/game/ragemp/localPlayer/RageLocalPlayerManager";
import { RageControlsManager } from "@RockMod/client/game/ragemp/controls/RageControlsManager";
import { RageKeysManager } from "@RockMod/client/game/ragemp/keys/RageKeysManager";

export class RageManagersFactory implements IManagersFactory {
  public createNetManager(): RageNetManager {
    return new RageNetManager();
  }

  public createBlipsManager(): RageBlipsManager {
    return new RageBlipsManager();
  }

  public createColshapesManager(): RageColshapesManager {
    return new RageColshapesManager();
  }

  public createMarkersManager(): RageMarkersManager {
    return new RageMarkersManager();
  }

  public createObjectsManager(): RageObjectsManager {
    return new RageObjectsManager();
  }

  public createPedsManager(): RagePedsManager {
    return new RagePedsManager();
  }

  public createPlayersManager(): RagePlayersManager {
    return new RagePlayersManager();
  }

  public createUtilsManager(): RageUtilsManager {
    return new RageUtilsManager();
  }

  public createVehiclesManager(): RageVehiclesManager {
    return new RageVehiclesManager();
  }

  public createBrowserManager(): RageBrowserManager {
    return new RageBrowserManager();
  }

  public createCameraManager(): RageCameraManager {
    return new RageCameraManager();
  }

  public createStorageManager(): RageStorageManager {
    return new RageStorageManager();
  }

  public createGraphicsManager(): RageGraphicsManager {
    return new RageGraphicsManager();
  }

  public createNativeManager(): RageNativeCallerManager {
    return new RageNativeCallerManager();
  }

  public createStreamingManager(): RageStreamingManager {
    return new RageStreamingManager();
  }

  public createLocalPlayerManager(): RageLocalPlayerManager {
    return new RageLocalPlayerManager();
  }

  public createControlsManager(): RageControlsManager {
    return new RageControlsManager();
  }

  public createKeysManager(): RageKeysManager {
    return new RageKeysManager();
  }
}
