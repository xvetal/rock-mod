import {
  ICircleColshapeCreateOptions,
  IColshapesManager,
  ICuboidColshapeCreateOptions,
  ICylinderColshapeCreateOptions,
  IRectangleColshapeCreateOptions,
  ISphereColshapeCreateOptions,
} from "../../common";
import { AltVWorldObjectsManager } from "../worldObject/AltVWorldObjectsManager";
import { AltVColshape } from "./AltVColshape";
import { AltVCircleColshape } from "./AltVCircleColshape";
import { AltVCuboidColshape } from "./AltVCuboidColshape";
import { AltVCylinderColshape } from "./AltVCylinderColshape";
import { AltVRectangleColshape } from "./AltVRectangleColshape";
import { AltVSphereColshape } from "./AltVSphereColshape";
import ColshapeCircle = AltVServer.ColshapeCircle;
import ColshapeCuboid = AltVServer.ColshapeCuboid;
import ColshapeCylinder = AltVServer.ColshapeCylinder;
import ColshapeRectangle = AltVServer.ColshapeRectangle;
import ColshapeSphere = AltVServer.ColshapeSphere;

export interface IAltVCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface IAltVCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface IAltVCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface IAltVRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface IAltVSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class AltVColshapesManager extends AltVWorldObjectsManager<AltVColshape> implements IColshapesManager {
  public constructor() {
    super({
      baseObjectsType: "colshape",
    });
  }

  public createCircle(options: IAltVCircleColshapeCreateOptions): AltVCircleColshape {
    const { range, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = new ColshapeCircle(x, y, range);
    mpEntity.dimension = dimension;

    const colshape = new AltVCircleColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: IAltVCuboidColshapeCreateOptions): AltVCuboidColshape {
    const { width, depth, height, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeCuboid(x, y, z, x + width, y + depth, z + height);
    mpEntity.dimension = dimension;

    const colshape = new AltVCuboidColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: IAltVCylinderColshapeCreateOptions): AltVCylinderColshape {
    const { height, range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeCylinder(x, y, z, range, height);
    mpEntity.dimension = dimension;

    const colshape = new AltVCylinderColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(options: IAltVRectangleColshapeCreateOptions): AltVRectangleColshape {
    const { width, height, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = new ColshapeRectangle(x, y, x + width, y + height);
    mpEntity.dimension = dimension;

    const colshape = new AltVRectangleColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createSphere(options: IAltVSphereColshapeCreateOptions): AltVSphereColshape {
    const { range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = new ColshapeSphere(x, y, z, range);
    mpEntity.dimension = dimension;

    const colshape = new AltVSphereColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }
}
