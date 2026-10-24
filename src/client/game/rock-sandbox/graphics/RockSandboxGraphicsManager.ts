import {
  type IGraphicsManager,
  type IScreenTextOptions,
  type IParticleFxAtCoordOptions,
  type ILoopedParticleFxAtCoordOptions,
} from "../../common/graphics/IGraphicsManager";
import { type IVector2D, type IVector3D } from "../../../../shared/common/utils";
import { Vector2D } from "../../../../shared/common/utils";
import { getRockSandbox } from "../../../internal/getRockSandbox";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGraphicsManager implements IGraphicsManager {
  public drawText(text: string, position: IVector2D, options?: IScreenTextOptions): void {
    getRockSandbox().screen.drawText(text, position, options);
  }

  public world3dToScreen2d(position: IVector3D): IVector2D | null {
    const result = getRockSandbox().screen.worldToScreen({ x: position.x, y: position.z, z: -position.y });
    return result === null ? null : new Vector2D(result.x, result.y);
  }

  public startScreenEffect(_effectName: string, _duration: number, _looped: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.startScreenEffect");
  }

  public stopScreenEffect(_effectName: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.stopScreenEffect");
  }

  public setPtfxAssetNextCall(_assetName: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.setPtfxAssetNextCall");
  }

  public startParticleFxNonLoopedAtCoord(_options: IParticleFxAtCoordOptions): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.startParticleFxNonLoopedAtCoord");
  }

  public startParticleFxLoopedAtCoord(_options: ILoopedParticleFxAtCoordOptions): number {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.startParticleFxLoopedAtCoord");
  }

  public stopParticleFxLooped(_handle: number, _p1: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.stopParticleFxLooped");
  }

  public getSafeZoneSize(): number {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.getSafeZoneSize");
  }

  public getActiveScreenResolution(): IVector2D {
    const { width, height } = getRockSandbox().screen.getResolution();
    return new Vector2D(width, height);
  }
}
