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

export interface ISpriteOptions {
  /** Центр спрайта в нормализованных экранных координатах (0..1). */
  position: IVector2D;
  /** Размер в нормализованных долях экрана. */
  width: number;
  height: number;
  heading?: number;
  color?: IRGBA;
}

export interface IRuntimeTextureResult {
  /** Текстура создана заново (false — обновлены пиксели существующей). */
  created: boolean;
  width: number;
  height: number;
}

export interface IGraphicsManager {
  /** Платформа умеет создавать текстуры из PNG во время игры. */
  readonly supportsRuntimeTextures: boolean;

  drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void;
  drawSprite(textureDict: string, textureName: string, options: ISpriteOptions): void;
  /**
   * Привязывает экранные координаты следующих 2D-вызовов к точке в мире:
   * игра проецирует её сама в момент отрисовки кадра. Закрывать `clearDrawOrigin`.
   */
  setDrawOrigin(position: IVector3D): void;
  clearDrawOrigin(): void;
  /**
   * Создаёт или обновляет текстуру `textureName` в runtime-словаре `textureDict` из PNG.
   * Повторный вызов с тем же именем допустим только с тем же размером картинки.
   */
  createRuntimeTexture(textureDict: string, textureName: string, png: Uint8Array): IRuntimeTextureResult;
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
