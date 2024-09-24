import { IManagersFactory } from "../common/IManagersFactory";
import { RagePlayersManager } from "./player/RagePlayersManager";
import { RageVehiclesManager } from "./vehicle/RageVehiclesManager";

export class RageManagersFactory implements IManagersFactory {
  public createPlayersManager(): RagePlayersManager {
    return new RagePlayersManager();
  }

  public createVehiclesManager(): RageVehiclesManager {
    return new RageVehiclesManager();
  }
}
