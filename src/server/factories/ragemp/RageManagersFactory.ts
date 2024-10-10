import { IManagersFactory } from "../common/IManagersFactory";
import { RageNetManager } from "../../net/ragemp/RageNetManager";
import { RageBlipsManager } from "../../entities/ragemp/blip/RageBlipsManager";
import { RageColshapesManager } from "../../entities/ragemp/colshape/RageColshapesManager";
import { RageMarkersManager } from "../../entities/ragemp/marker/RageMarkersManager";
import { RageObjectsManager } from "../../entities/ragemp/object/RageObjectsManager";
import { RagePedsManager } from "../../entities/ragemp/ped/RagePedsManager";
import { RagePlayersManager } from "../../entities/ragemp/player/RagePlayersManager";
import { RageVehiclesManager } from "../../entities/ragemp/vehicle/RageVehiclesManager";

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

  public createPlayersManager(net: RageNetManager): RagePlayersManager {
    return new RagePlayersManager(net);
  }

  public createVehiclesManager(): RageVehiclesManager {
    return new RageVehiclesManager();
  }
}
