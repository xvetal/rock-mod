import { type IWorldObjectCreateOptions, type IWorldObjectsManager } from "../worldObject";
import { type IColshape } from "./IColshape";
import { type ICircleColshape } from "./ICircleColshape";
import { type ICuboidColshape } from "./ICuboidColshape";
import { type ICylinderColshape } from "./ICylinderColshape";
import { type IRectangleColshape } from "./IRectangleColshape";
import { type ISphereColshape } from "./ISphereColshape";
import { type IPlayer } from "../player";

export interface ICircleColshapeCreateOptions extends IWorldObjectCreateOptions {
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
  getParticipants(colshape: IColshape): Set<IPlayer>;
}
