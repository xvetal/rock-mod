import { type IRGBA, type IVector2D, type IVector3D } from "@shared/common/utils";

export type IParticleFxVector3D = Pick<IVector3D, "x" | "y" | "z">;

export interface IScreenTextOptions {
  font: number;
  color: IRGBA;
  scale: [number, number];
  outline: boolean;
  centre: boolean;
}

export interface IParticleFxAtCoordOptions {
  effectName: string;
  position: IParticleFxVector3D;
  rotation: IParticleFxVector3D;
  scale: number;
  xAxis: boolean;
  yAxis: boolean;
  zAxis: boolean;
}

export interface ILoopedParticleFxAtCoordOptions extends IParticleFxAtCoordOptions {
  p11: boolean;
}

export interface IGraphicsManager {
  drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void;
  world3dToScreen2d(position: IVector3D): IVector2D | null;
  startScreenEffect(effectName: string, duration: number, looped: boolean): void;
  stopScreenEffect(effectName: string): void;
  setPtfxAssetNextCall(assetName: string): void;
  startParticleFxNonLoopedAtCoord(options: IParticleFxAtCoordOptions): boolean;
  startParticleFxLoopedAtCoord(options: ILoopedParticleFxAtCoordOptions): number;
  stopParticleFxLooped(handle: number, p1: boolean): void;
  getSafeZoneSize(): number;
  getActiveScreenResolution(): IVector2D;
}
