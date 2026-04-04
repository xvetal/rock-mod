import { type IBaseObject, type IBaseObjectOptions } from "../baseObject";
import { type IVector3D } from "@shared/common/utils";

export interface IWorldObjectOptions extends IBaseObjectOptions {}

export interface IWorldObject extends IBaseObject {
  get position(): IVector3D;
  get dimension(): number;
  setPosition(value: IVector3D): void;
  setDimension(value: number): void;
  setCoords(
    xPos: number,
    yPos: number,
    zPos: number,
    xAxis: boolean,
    yAxis: boolean,
    zAxis: boolean,
    clearArea: boolean,
  ): void;
}
