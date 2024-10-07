import { IBaseObject, IBaseObjectOptions } from "../baseObject";
import { IVector3D } from "../../../common/utils";

export interface IWorldObjectOptions extends IBaseObjectOptions {}

export interface IWorldObject extends IBaseObject {
  get position(): IVector3D;
  get dimension(): number;
  setPosition(value: IVector3D): void;
  setDimension(value: number): void;
}
