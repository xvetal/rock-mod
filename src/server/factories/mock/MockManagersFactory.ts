import { type IManagersFactory } from "../common/IManagersFactory";
import { MockNetManager } from "../../net/mock/MockNetManager";
import { MockPlayersManager } from "../../entities/mock/player/MockPlayersManager";
import { MockBlipsManager } from "../../entities/mock/blip/MockBlipsManager";
import { MockColshapesManager } from "../../entities/mock/colshape/MockColshapesManager";
import { MockMarkersManager } from "../../entities/mock/marker/MockMarkersManager";
import { MockObjectsManager } from "../../entities/mock/object/MockObjectsManager";
import { MockPedsManager } from "../../entities/mock/ped/MockPedsManager";
import { MockUtilsManager } from "../../utils/mock/MockUtilsManager";
import { MockVehiclesManager } from "../../entities/mock/vehicle/MockVehiclesManager";
import { MockWorldManager } from "../../world/mock/MockWorldManager";

export class MockManagersFactory implements IManagersFactory {
  public createNetManager(): MockNetManager {
    return new MockNetManager();
  }

  public createBlipsManager(): MockBlipsManager {
    return new MockBlipsManager();
  }

  public createColshapesManager(): MockColshapesManager {
    return new MockColshapesManager();
  }

  public createMarkersManager(): MockMarkersManager {
    return new MockMarkersManager();
  }

  public createObjectsManager(): MockObjectsManager {
    return new MockObjectsManager();
  }

  public createPedsManager(): MockPedsManager {
    return new MockPedsManager();
  }

  public createPlayersManager(): MockPlayersManager {
    return new MockPlayersManager();
  }

  public createUtilsManager(): MockUtilsManager {
    return new MockUtilsManager();
  }

  public createVehiclesManager(): MockVehiclesManager {
    return new MockVehiclesManager();
  }

  public createWorldManager(): MockWorldManager {
    return new MockWorldManager();
  }
}
