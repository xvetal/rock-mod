import { type IStreamingManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class RageStreamingManager implements IStreamingManager {
  public requestAnimationDictionary(dictionary: string): void {
    mp.game.streaming.requestAnimDict(dictionary);
  }

  public hasAnimationDictionaryLoaded(dictionary: string): boolean {
    return mp.game.streaming.hasAnimDictLoaded(dictionary);
  }

  public removeAnimationDictionary(dictionary: string): void {
    mp.game.streaming.removeAnimDict(dictionary);
  }

  public requestNamedPtfxAsset(assetName: string): void {
    mp.game.streaming.requestNamedPtfxAsset(assetName);
  }

  public hasNamedPtfxAssetLoaded(assetName: string): boolean {
    return mp.game.streaming.hasNamedPtfxAssetLoaded(assetName);
  }

  public isModelInCdimage(model: string): boolean {
    const modelHash = mp.game.joaat(model);
    return mp.game.streaming.isModelInCdimage(modelHash);
  }

  public requestModel(modelHash: number): void {
    mp.game.streaming.requestModel(modelHash);
  }

  public hasModelLoaded(modelHash: number): boolean {
    return mp.game.streaming.hasModelLoaded(modelHash);
  }

  public requestIpl(iplName: string): void {
    mp.game.streaming.requestIpl(iplName);
  }

  public removeIpl(iplName: string): void {
    mp.game.streaming.removeIpl(iplName);
  }

  public setFocusArea(position: IVector3D, offset: IVector3D): void {
    mp.game.streaming.setFocusArea(position.x, position.y, position.z, offset.x, offset.y, offset.z);
  }

  public clearFocus(): void {
    mp.game.streaming.clearFocus();
  }

  public setFocusEntity(entityHandle: number): void {
    mp.game.streaming.setFocusEntity(entityHandle);
  }
}
