import { type IManagersFactory } from "../common/IManagersFactory";
import { CCMPNetManager } from "../../net/ccmp/CCMPNetManager";
import { CCMPBlipsManager } from "../../entities/ccmp/blip/CCMPBlipsManager";
import { CCMPColshapesManager } from "../../entities/ccmp/colshape/CCMPColshapesManager";
import { CCMPMarkersManager } from "../../entities/ccmp/marker/CCMPMarkersManager";
import { CCMPObjectsManager } from "../../entities/ccmp/object/CCMPObjectsManager";
import { CCMPPedsManager } from "../../entities/ccmp/ped/CCMPPedsManager";
import { CCMPPlayersManager } from "../../entities/ccmp/player/CCMPPlayersManager";
import { CCMPUtilsManager } from "../../utils/ccmp/CCMPUtilsManager";
import { CCMPVehiclesManager } from "../../entities/ccmp/vehicle/CCMPVehiclesManager";
import { CCMPWorldManager } from "../../world/ccmp/CCMPWorldManager";

export class CCMPManagersFactory implements IManagersFactory {
  public createNetManager(): CCMPNetManager {
    return new CCMPNetManager();
  }

  public createBlipsManager(): CCMPBlipsManager {
    return new CCMPBlipsManager();
  }

  public createColshapesManager(): CCMPColshapesManager {
    return new CCMPColshapesManager();
  }

  public createMarkersManager(): CCMPMarkersManager {
    return new CCMPMarkersManager();
  }

  public createObjectsManager(): CCMPObjectsManager {
    return new CCMPObjectsManager();
  }

  public createPedsManager(): CCMPPedsManager {
    return new CCMPPedsManager();
  }

  public createPlayersManager(net: CCMPNetManager): CCMPPlayersManager {
    return new CCMPPlayersManager(net);
  }

  public createUtilsManager(): CCMPUtilsManager {
    return new CCMPUtilsManager();
  }

  public createVehiclesManager(): CCMPVehiclesManager {
    return new CCMPVehiclesManager();
  }

  public createWorldManager(): CCMPWorldManager {
    return new CCMPWorldManager();
  }
}
