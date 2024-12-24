import { type IWorldObject, type IWorldObjectOptions } from "../worldObject/IWorldObject";
import { type IVector3D } from "@shared/common/utils";

export interface IEntityOptions extends IWorldObjectOptions {}

export interface IEntity extends IWorldObject {
  get model(): number;
  get rotation(): IVector3D;
  setModel(value: string): void;
  setRotation(value: IVector3D): void;
}
