import { IWorldObject, IWorldObjectOptions } from "../worldObject/IWorldObject";
import { IVector3D } from "../../../common/utils";

export interface IEntityOptions extends IWorldObjectOptions {}

export interface IEntity extends IWorldObject {
  get model(): number;
  get rotation(): IVector3D;
  setModel(value: string): void;
  setRotation(value: IVector3D): void;
}
