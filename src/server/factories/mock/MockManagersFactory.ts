import { type IManagersFactory } from "../common/IManagersFactory";
import { MockNetManager } from "../../net/mock/MockNetManager";
import { MockPlayersManager } from "../../entities/mock/player/MockPlayersManager";
import { type IUtilsManager } from "../../utils";
import { MockBlipsManager } from "../../entities/mock/blip/MockBlipsManager";
import { MockColshapesManager } from "../../entities/mock/colshape/MockColshapesManager";
import { MockMarkersManager } from "../../entities/mock/marker/MockMarkersManager";
import { MockObjectsManager } from "../../entities/mock/object/MockObjectsManager";
import { MockPedsManager } from "../../entities/mock/ped/MockPedsManager";
import { MockVehiclesManager } from "../../entities/mock/vehicle/MockVehiclesManager";
import { MockUtilsManager } from "../../utils/mock/MockUtilsManager";

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

  public createUtilsManager(): IUtilsManager {
    return new MockUtilsManager();
  }

  public createVehiclesManager(): MockVehiclesManager {
    return new MockVehiclesManager();
  }
}
