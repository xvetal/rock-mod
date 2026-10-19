import {
  type IColshapesManager,
  type ICircleColshapeCreateOptions,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { type IColshape } from "../../common/colshape/IColshape";
import { type ICircleColshape } from "../../common/colshape/ICircleColshape";
import { type ICuboidColshape } from "../../common/colshape/ICuboidColshape";
import { type ICylinderColshape } from "../../common/colshape/ICylinderColshape";
import { type IRectangleColshape } from "../../common/colshape/IRectangleColshape";
import { type ISphereColshape } from "../../common/colshape/ISphereColshape";
import { RockSandboxWorldObjectsManager } from "../worldObject/RockSandboxWorldObjectsManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxColshapesManager
  extends RockSandboxWorldObjectsManager<IColshape>
  implements IColshapesManager
{
  public createCircle(_options: ICircleColshapeCreateOptions): ICircleColshape {
    return rockSandboxNotImplemented("client", "RockSandboxColshapesManager.createCircle");
  }

  public createCuboid(_options: ICuboidColshapeCreateOptions): ICuboidColshape {
    return rockSandboxNotImplemented("client", "RockSandboxColshapesManager.createCuboid");
  }

  public createCylinder(_options: ICylinderColshapeCreateOptions): ICylinderColshape {
    return rockSandboxNotImplemented("client", "RockSandboxColshapesManager.createCylinder");
  }

  public createRectangle(_options: IRectangleColshapeCreateOptions): IRectangleColshape {
    return rockSandboxNotImplemented("client", "RockSandboxColshapesManager.createRectangle");
  }

  public createSphere(_options: ISphereColshapeCreateOptions): ISphereColshape {
    return rockSandboxNotImplemented("client", "RockSandboxColshapesManager.createSphere");
  }
}
