import { type IStreamingManager } from "../../common/streaming/IStreamingManager";
import { type IVector3D } from "../../../../shared/common/utils";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxStreamingManager implements IStreamingManager {
  public requestAnimationDictionary(_dictionary: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.requestAnimationDictionary");
  }

  public hasAnimationDictionaryLoaded(_dictionary: string): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.hasAnimationDictionaryLoaded");
  }

  public removeAnimationDictionary(_dictionary: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.removeAnimationDictionary");
  }

  public requestNamedPtfxAsset(_assetName: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.requestNamedPtfxAsset");
  }

  public hasNamedPtfxAssetLoaded(_assetName: string): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.hasNamedPtfxAssetLoaded");
  }

  public isModelInCdimage(_model: string): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.isModelInCdimage");
  }

  public requestModel(_modelHash: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.requestModel");
  }

  public hasModelLoaded(_modelHash: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.hasModelLoaded");
  }

  public requestIpl(_iplName: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.requestIpl");
  }

  public removeIpl(_iplName: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.removeIpl");
  }

  public setFocusArea(_position: IVector3D, _offset: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.setFocusArea");
  }

  public clearFocus(): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.clearFocus");
  }

  public setFocusEntity(_entityHandle: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxStreamingManager.setFocusEntity");
  }
}
