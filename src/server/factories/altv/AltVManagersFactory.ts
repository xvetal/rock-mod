import { IManagersFactory } from "../common/IManagersFactory";
import { AltVNetManager } from "../../net/altv/AltVNetManager";
import { AltVPlayersManager } from "../../entities/altv/player/AltVPlayersManager";
import { AltVVehiclesManager } from "../../entities/altv/vehicle/AltVVehiclesManager";

export class AltVManagersFactory implements IManagersFactory {
  public createNetManager(): AltVNetManager {
    return new AltVNetManager();
  }

  public createPlayersManager(net: AltVNetManager): AltVPlayersManager {
    return new AltVPlayersManager(net);
  }

  public createVehiclesManager(net: AltVNetManager): AltVVehiclesManager {
    return new AltVVehiclesManager(net);
  }
}
