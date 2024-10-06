import { IManagersFactory } from "../common/IManagersFactory";
import { AltVNetManager } from "../../net/altv/AltVNetManager";
import { AltVObjectsManager } from "../../entities/altv/object/AltVObjectsManager";
import { AltVPlayersManager } from "../../entities/altv/player/AltVPlayersManager";
import { AltVVehiclesManager } from "../../entities/altv/vehicle/AltVVehiclesManager";

export class AltVManagersFactory implements IManagersFactory {
  public createNetManager(): AltVNetManager {
    return new AltVNetManager();
  }

  public createObjectsManager(): AltVObjectsManager {
    return new AltVObjectsManager();
  }

  public createPlayersManager(): AltVPlayersManager {
    return new AltVPlayersManager();
  }

  public createVehiclesManager(): AltVVehiclesManager {
    return new AltVVehiclesManager();
  }
}
