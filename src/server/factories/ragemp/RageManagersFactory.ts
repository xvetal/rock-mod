import { IManagersFactory } from "../common/IManagersFactory";
import { RageNetManager } from "../../net/ragemp/RageNetManager";
import { RageObjectsManager } from "../../entities/ragemp/object/RageObjectsManager";
import { RagePlayersManager } from "../../entities/ragemp/player/RagePlayersManager";
import { RageVehiclesManager } from "../../entities/ragemp/vehicle/RageVehiclesManager";

export class RageManagersFactory implements IManagersFactory {
  public createNetManager(): RageNetManager {
    return new RageNetManager();
  }

  public createObjectsManager(): RageObjectsManager {
    return new RageObjectsManager();
  }

  public createPlayersManager(): RagePlayersManager {
    return new RagePlayersManager();
  }

  public createVehiclesManager(): RageVehiclesManager {
    return new RageVehiclesManager();
  }
}
