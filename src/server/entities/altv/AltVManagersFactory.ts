import { IManagersFactory } from "../common/IManagersFactory";
import { AltVPlayersManager } from "./player/AltVPlayersManager";
import { AltVVehiclesManager } from "./vehicle/AltVVehiclesManager";

export class AltVManagersFactory implements IManagersFactory {
  public createPlayersManager(): AltVPlayersManager {
    return new AltVPlayersManager();
  }

  public createVehiclesManager(): AltVVehiclesManager {
    return new AltVVehiclesManager();
  }
}
