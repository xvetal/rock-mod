import {
  type IGraphicsManager,
  type IScreenTextOptions,
  type IParticleFxAtCoordOptions,
  type ILoopedParticleFxAtCoordOptions,
} from "../../common/graphics/IGraphicsManager";
import { type IVector2D, type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxGraphicsManager implements IGraphicsManager {
  public drawText(_text: string, _position: IVector2D, _options?: IScreenTextOptions): void {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.drawText");
  }

  public world3dToScreen2d(_position: IVector3D): IVector2D | null {
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.world3dToScreen2d");
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
    return rockSandboxNotImplemented("client", "RockSandboxGraphicsManager.getActiveScreenResolution");
  }
}
