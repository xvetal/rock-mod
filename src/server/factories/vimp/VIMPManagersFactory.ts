import { type IManagersFactory } from "../common/IManagersFactory";
import { CCMPNetManager } from "../../net/vimp/VIMPNetManager";
import { CCMPBlipsManager } from "../../entities/vimp/blip/VIMPBlipsManager";
import { CCMPColshapesManager } from "../../entities/vimp/colshape/VIMPColshapesManager";
import { CCMPMarkersManager } from "../../entities/vimp/marker/VIMPMarkersManager";
import { CCMPObjectsManager } from "../../entities/vimp/object/VIMPObjectsManager";
import { CCMPPedsManager } from "../../entities/vimp/ped/VIMPPedsManager";
import { CCMPPlayersManager } from "../../entities/vimp/player/VIMPPlayersManager";
import { CCMPUtilsManager } from "../../utils/vimp/VIMPUtilsManager";
import { CCMPVehiclesManager } from "../../entities/vimp/vehicle/VIMPVehiclesManager";
import { CCMPWorldManager } from "../../world/vimp/VIMPWorldManager";

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
