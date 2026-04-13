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
import { type IBrowserManager, type IVehicleNativeManager } from "@RockMod/client/entities";
import { RageVehicleNativeManager } from "@RockMod/client/entities/ragemp/vehicle/RageVehicleNativeManager";
import { RageBrowserManager } from "@RockMod/client/entities/ragemp/browser/RageBrowserManager";

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

  public createVehicleNativeManager(): IVehicleNativeManager {
    return new RageVehicleNativeManager();
  }

  public createBrowserManager(): IBrowserManager {
    return new RageBrowserManager();
  }
}
