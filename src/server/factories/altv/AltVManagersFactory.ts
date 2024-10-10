import { IManagersFactory } from "../common/IManagersFactory";
import { AltVNetManager } from "../../net/altv/AltVNetManager";
import { AltVBlipsManager } from "../../entities/altv/blip/AltVBlipsManager";
import { AltVColshapesManager } from "../../entities/altv/colshape/AltVColshapesManager";
import { AltVMarkersManager } from "../../entities/altv/marker/AltVMarkersManager";
import { AltVObjectsManager } from "../../entities/altv/object/AltVObjectsManager";
import { AltVPedsManager } from "../../entities/altv/ped/AltVPedsManager";
import { AltVPlayersManager } from "../../entities/altv/player/AltVPlayersManager";
import { AltVVehiclesManager } from "../../entities/altv/vehicle/AltVVehiclesManager";

export class AltVManagersFactory implements IManagersFactory {
  public createNetManager(): AltVNetManager {
    return new AltVNetManager();
  }

  public createBlipsManager(): AltVBlipsManager {
    return new AltVBlipsManager();
  }

  public createColshapesManager(): AltVColshapesManager {
    return new AltVColshapesManager();
  }

  public createMarkersManager(): AltVMarkersManager {
    return new AltVMarkersManager();
  }

  public createObjectsManager(): AltVObjectsManager {
    return new AltVObjectsManager();
  }

  public createPedsManager(): AltVPedsManager {
    return new AltVPedsManager();
  }

  public createPlayersManager(): AltVPlayersManager {
    return new AltVPlayersManager();
  }

  public createVehiclesManager(): AltVVehiclesManager {
    return new AltVVehiclesManager();
  }
}
