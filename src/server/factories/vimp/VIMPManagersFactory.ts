import { type IManagersFactory } from "../common/IManagersFactory";
import { VIMPNetManager } from "../../net/vimp/VIMPNetManager";
import { VIMPBlipsManager } from "../../entities/vimp/blip/VIMPBlipsManager";
import { VIMPColshapesManager } from "../../entities/vimp/colshape/VIMPColshapesManager";
import { VIMPMarkersManager } from "../../entities/vimp/marker/VIMPMarkersManager";
import { VIMPObjectsManager } from "../../entities/vimp/object/VIMPObjectsManager";
import { VIMPPedsManager } from "../../entities/vimp/ped/VIMPPedsManager";
import { VIMPPlayersManager } from "../../entities/vimp/player/VIMPPlayersManager";
import { VIMPUtilsManager } from "../../utils/vimp/VIMPUtilsManager";
import { VIMPVehiclesManager } from "../../entities/vimp/vehicle/VIMPVehiclesManager";
import { VIMPWorldManager } from "../../world/vimp/VIMPWorldManager";

export class VIMPManagersFactory implements IManagersFactory {
  public createNetManager(): VIMPNetManager {
    return new VIMPNetManager();
  }

  public createBlipsManager(): VIMPBlipsManager {
    return new VIMPBlipsManager();
  }

  public createColshapesManager(): VIMPColshapesManager {
    return new VIMPColshapesManager();
  }

  public createMarkersManager(): VIMPMarkersManager {
    return new VIMPMarkersManager();
  }

  public createObjectsManager(): VIMPObjectsManager {
    return new VIMPObjectsManager();
  }

  public createPedsManager(): VIMPPedsManager {
    return new VIMPPedsManager();
  }

  public createPlayersManager(net: VIMPNetManager): VIMPPlayersManager {
    return new VIMPPlayersManager(net);
  }

  public createUtilsManager(): VIMPUtilsManager {
    return new VIMPUtilsManager();
  }

  public createVehiclesManager(): VIMPVehiclesManager {
    return new VIMPVehiclesManager();
  }

  public createWorldManager(): VIMPWorldManager {
    return new VIMPWorldManager();
  }
}
