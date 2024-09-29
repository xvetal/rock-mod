import { IManagersFactory } from "../common/IManagersFactory";
import { AltVNetManager } from "../../net/altv/AltVNetManager";
import { AltVPlayersManager } from "./player/AltVPlayersManager";
import { AltVVehiclesManager } from "./vehicle/AltVVehiclesManager";

export class AltVManagersFactory implements IManagersFactory {
  public createNetManager(): AltVNetManager {
    return new AltVNetManager();
  }

  public createPlayersManager(): AltVPlayersManager {
    return new AltVPlayersManager();
  }

  public createVehiclesManager(): AltVVehiclesManager {
    return new AltVVehiclesManager();
  }
}
