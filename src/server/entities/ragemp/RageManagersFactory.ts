import { IManagersFactory } from "../common/IManagersFactory";
import { RageNetManager } from "../../net/ragemp/RageNetManager";
import { RagePlayersManager } from "./player/RagePlayersManager";
import { RageVehiclesManager } from "./vehicle/RageVehiclesManager";

export class RageManagersFactory implements IManagersFactory {
  public createNetManager(): RageNetManager {
    return new RageNetManager();
  }

  public createPlayersManager(net: RageNetManager): RagePlayersManager {
    return new RagePlayersManager(net);
  }

  public createVehiclesManager(net: RageNetManager): RageVehiclesManager {
    return new RageVehiclesManager(net);
  }
}
