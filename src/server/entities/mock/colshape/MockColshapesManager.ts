import {
  type ICircleColshapeCreateOptions,
  type IColshapesManager,
  type ICuboidColshapeCreateOptions,
  type ICylinderColshapeCreateOptions,
  type IRectangleColshapeCreateOptions,
  type ISphereColshapeCreateOptions,
} from "../../common";
import { MockWorldObjectsManager } from "../worldObject/MockWorldObjectsManager";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { MockCircleColshape } from "./MockCircleColshape";
import { MockCuboidColshape } from "./MockCuboidColshape";
import { MockCylinderColshape } from "./MockCylinderColshape";
import { MockRectangleColshape } from "./MockRectangleColshape";
import { MockSphereColshape } from "./MockSphereColshape";
import { type MockColshape } from "./MockColshape";
import { BaseObjectType } from "../../../../shared";
import { type MockPlayer } from "../player/MockPlayer";

export interface IMockCircleColshapeCreateOptions extends ICircleColshapeCreateOptions {}
export interface IMockCuboidColshapeCreateOptions extends ICuboidColshapeCreateOptions {}
export interface IMockCylinderColshapeCreateOptions extends ICylinderColshapeCreateOptions {}
export interface IMockRectangleColshapeCreateOptions extends IRectangleColshapeCreateOptions {}
export interface IMockSphereColshapeCreateOptions extends ISphereColshapeCreateOptions {}

export class MockColshapesManager extends MockWorldObjectsManager<MockColshape> implements IColshapesManager {
  private _nextId: number;

  public constructor() {
    super({
      baseObjectsType: BaseObjectType.Colshape,
    });

    this._nextId = 0;
  }

  public createCircle(options: IMockCircleColshapeCreateOptions): MockCircleColshape {
    const { range, position, dimension, key } = options;
    const { x, y } = position;

    const colshape = new MockCircleColshape({
      id: this._nextId++,
      type: BaseObjectType.Colshape,
      range,
      position: new Vector3D(x, y, 0),
      dimension,
    });

    if (key !== undefined) colshape.setNetData("key", key);

    this.registerBaseObject(colshape);
    return colshape;
  }

  public createCuboid(options: IMockCuboidColshapeCreateOptions): MockCuboidColshape {
    const { width, depth, height, position, dimension, key } = options;
    const { x, y, z } = position;

    const colshape = new MockCuboidColshape({
      id: this._nextId++,
      type: BaseObjectType.Colshape,
      width,
      depth,
      height,
      position: new Vector3D(x, y, z),
      dimension,
    });

    if (key !== undefined) colshape.setNetData("key", key);

    this.registerBaseObject(colshape);
    return colshape;
  }

  public createCylinder(options: IMockCylinderColshapeCreateOptions): MockCylinderColshape {
    const { height, range, position, dimension, key } = options;
    const { x, y, z } = position;

    const colshape = new MockCylinderColshape({
      id: this._nextId++,
      type: BaseObjectType.Colshape,
      range,
      height,
      position: new Vector3D(x, y, z),
      dimension,
    });

    if (key !== undefined) colshape.setNetData("key", key);

    this.registerBaseObject(colshape);
    return colshape;
  }

  public createRectangle(options: IMockRectangleColshapeCreateOptions): MockRectangleColshape {
    const { width, height, position, dimension, key } = options;
    const { x, y } = position;

    const colshape = new MockRectangleColshape({
      id: this._nextId++,
      type: BaseObjectType.Colshape,
      width,
      height,
      position: new Vector3D(x, y, 0),
      dimension,
    });

    if (key !== undefined) colshape.setNetData("key", key);

    this.registerBaseObject(colshape);
    return colshape;
  }

  public createSphere(options: IMockSphereColshapeCreateOptions): MockSphereColshape {
    const { range, position, dimension, key } = options;
    const { x, y, z } = position;

    const colshape = new MockSphereColshape({
      id: this._nextId++,
      type: BaseObjectType.Colshape,
      range,
      position: new Vector3D(x, y, z),
      dimension,
    });

    if (key !== undefined) colshape.setNetData("key", key);

    this.registerBaseObject(colshape);
    return colshape;
  }

  public getParticipants(): Set<MockPlayer> {
    return new Set();
  }
}
