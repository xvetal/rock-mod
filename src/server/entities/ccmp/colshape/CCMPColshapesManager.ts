import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common/colshape/IColshapesManager";
import { CCMPWorldObjectsManager } from "../worldObject/CCMPWorldObjectsManager";
import { type CCMPColshape } from "./CCMPColshape";
import { type CCMPCircleColshape } from "./CCMPCircleColshape";
import { type CCMPCuboidColshape } from "./CCMPCuboidColshape";
import { type CCMPCylinderColshape } from "./CCMPCylinderColshape";
import { type CCMPRectangleColshape } from "./CCMPRectangleColshape";
import { type CCMPSphereColshape } from "./CCMPSphereColshape";
import { type CCMPPlayer } from "../player/CCMPPlayer";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPColshapesManager extends CCMPWorldObjectsManager<CCMPColshape> implements IColshapesManager {
  public constructor() {
    super({
      baseObjectsType: "colshape",
    });
  }

  public createCircle(_options: ICircleColshapeCreateOptions): CCMPCircleColshape {
    return notImplemented("CCMPColshapesManager.createCircle");
  }

  public createCuboid(_options: ICuboidColshapeCreateOptions): CCMPCuboidColshape {
    return notImplemented("CCMPColshapesManager.createCuboid");
  }

  public createCylinder(_options: ICylinderColshapeCreateOptions): CCMPCylinderColshape {
    return notImplemented("CCMPColshapesManager.createCylinder");
  }

  public createRectangle(_options: IRectangleColshapeCreateOptions): CCMPRectangleColshape {
    return notImplemented("CCMPColshapesManager.createRectangle");
  }

  public createSphere(_options: ISphereColshapeCreateOptions): CCMPSphereColshape {
    return notImplemented("CCMPColshapesManager.createSphere");
  }

  public getParticipants(_colshape: CCMPColshape): Set<CCMPPlayer> {
    return notImplemented("CCMPColshapesManager.getParticipants");
  }
}
