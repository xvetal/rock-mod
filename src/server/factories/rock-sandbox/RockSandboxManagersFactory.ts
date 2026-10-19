import { type IManagersFactory } from "../common/IManagersFactory";
import { type INetManager } from "../../net/common/INetManager";
import { RockSandboxNetManager } from "../../net/rock-sandbox/RockSandboxNetManager";
import { RockSandboxBlipsManager } from "../../entities/rock-sandbox/blip/RockSandboxBlipsManager";
import { RockSandboxColshapesManager } from "../../entities/rock-sandbox/colshape/RockSandboxColshapesManager";
import { RockSandboxMarkersManager } from "../../entities/rock-sandbox/marker/RockSandboxMarkersManager";
import { RockSandboxObjectsManager } from "../../entities/rock-sandbox/object/RockSandboxObjectsManager";
import { RockSandboxPedsManager } from "../../entities/rock-sandbox/ped/RockSandboxPedsManager";
import { RockSandboxPlayersManager } from "../../entities/rock-sandbox/player/RockSandboxPlayersManager";
import { RockSandboxUtilsManager } from "../../utils/rock-sandbox/RockSandboxUtilsManager";
import { RockSandboxVehiclesManager } from "../../entities/rock-sandbox/vehicle/RockSandboxVehiclesManager";
import { RockSandboxWorldManager } from "../../world/rock-sandbox/RockSandboxWorldManager";

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

  public createPlayersManager(_net: INetManager): RockSandboxPlayersManager {
    return new RockSandboxPlayersManager();
  }

  public createUtilsManager(): RockSandboxUtilsManager {
    return new RockSandboxUtilsManager();
  }

  public createVehiclesManager(): RockSandboxVehiclesManager {
    return new RockSandboxVehiclesManager();
  }

  public createWorldManager(): RockSandboxWorldManager {
    return new RockSandboxWorldManager();
  }
}
