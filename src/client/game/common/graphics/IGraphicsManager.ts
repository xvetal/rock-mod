import { type IRGBA, type IVector2D } from "@shared/common/utils";

export interface IScreenTextOptions {
  font: number;
  color: IRGBA;
  scale: [number, number];
  outline: boolean;
  centre: boolean;
}

export interface IGraphicsManager {
  drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void;
}
