import { IWorldObjectCreateOptions, IWorldObjectsManager } from "../worldObject";
import { IColshape } from "./IColshape";
import { IVector2D } from "../../../common/utils";
import { ICircleColshape } from "./ICircleColshape";
import { ICuboidColshape } from "./ICuboidColshape";
import { ICylinderColshape } from "./ICylinderColshape";
import { IRectangleColshape } from "./IRectangleColshape";
import { ISphereColshape } from "./ISphereColshape";

export interface ICircleColshapeCreateOptions extends Omit<IWorldObjectCreateOptions, "position"> {
  position: IVector2D;
  range: number;
}

export interface ICuboidColshapeCreateOptions extends IWorldObjectCreateOptions {
  width: number;
  depth: number;
  height: number;
}

export interface ICylinderColshapeCreateOptions extends IWorldObjectCreateOptions {
  range: number;
  height: number;
}

export interface IRectangleColshapeCreateOptions extends IWorldObjectCreateOptions {
  width: number;
  height: number;
}

export interface ISphereColshapeCreateOptions extends IWorldObjectCreateOptions {
  range: number;
}

export interface IColshapesManager extends IWorldObjectsManager<IColshape> {
  createCircle(options: ICircleColshapeCreateOptions): ICircleColshape;
  createCuboid(options: ICuboidColshapeCreateOptions): ICuboidColshape;
  createCylinder(options: ICylinderColshapeCreateOptions): ICylinderColshape;
  createRectangle(options: IRectangleColshapeCreateOptions): IRectangleColshape;
  createSphere(options: ISphereColshapeCreateOptions): ISphereColshape;
}
