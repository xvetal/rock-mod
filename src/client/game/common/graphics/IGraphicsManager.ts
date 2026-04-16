import { type IRGBA, type IVector2D, type IVector3D } from "@shared/common/utils";

export interface IScreenTextOptions {
  font: number;
  color: IRGBA;
  scale: [number, number];
  outline: boolean;
  centre: boolean;
}

export interface IGraphicsManager {
  drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void;
  world3dToScreen2d(position: IVector3D): IVector2D | null;
  startScreenEffect(effectName: string, duration: number, looped: boolean): void;
  stopScreenEffect(effectName: string): void;
}
