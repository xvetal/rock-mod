import { RageWorldObjectsManager } from "../worldObject/RageWorldObjectsManager";
import { RageColshape } from "./RageColshape";
import {
  ICircleColshapeCreateOptions,
  IColshapesManager,
  ICuboidColshapeCreateOptions,
  ICylinderColshapeCreateOptions,
  IRectangleColshapeCreateOptions,
  ISphereColshapeCreateOptions,
} from "../../common";
import { RageCircleColshape } from "./RageCircleColshape";
import { RageCuboidColshape } from "./RageCuboidColshape";
import { RageCylinderColshape } from "./RageCylinderColshape";
import { RageRectangleColshape } from "./RageRectangleColshape";
import { RageSphereColshape } from "./RageSphereColshape";

export interface IRageCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}

export interface IRageCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}

export interface IRageCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}

export interface IRageRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}

export interface IRageSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class RageColshapesManager extends RageWorldObjectsManager<RageColshape> implements IColshapesManager {
  public constructor() {
    super({
      baseObjectsType: "colshape",
    });
  }

  public createCircle(options: IRageCircleColshapeCreateOptions): RageCircleColshape {
    const { range, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = mp.colshapes.newCircle(x, y, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCircleColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCuboid(options: IRageCuboidColshapeCreateOptions): RageCuboidColshape {
    const { width, depth, height, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newCuboid(x, y, z, width, depth, height, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCuboidColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createCylinder(options: IRageCylinderColshapeCreateOptions): RageCylinderColshape {
    const { height, range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newTube(x, y, z, height, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageCylinderColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createRectangle(options: IRageRectangleColshapeCreateOptions): RageRectangleColshape {
    const { width, height, position, dimension } = options;
    const { x, y } = position;

    const mpEntity = mp.colshapes.newRectangle(x, y, width, height, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageRectangleColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }

  public createSphere(options: IRageSphereColshapeCreateOptions): RageSphereColshape {
    const { range, position, dimension } = options;
    const { x, y, z } = position;

    const mpEntity = mp.colshapes.newSphere(x, y, z, range, dimension);
    mpEntity.isExists = (): boolean => mp.colshapes.exists(mpEntity);

    const colshape = new RageSphereColshape({ mpEntity });
    this.registerBaseObject(colshape);

    return colshape;
  }
}
