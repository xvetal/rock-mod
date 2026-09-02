import type {} from "@vimp-mp/types/client";
import { type IStreamingManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class VIMPStreamingManager implements IStreamingManager {
  public requestAnimationDictionary(dictionary: string): void {
    vimp.natives.streaming.requestAnimDict(dictionary);
  }

  public hasAnimationDictionaryLoaded(dictionary: string): boolean {
    return vimp.natives.streaming.hasAnimDictLoaded(dictionary);
  }

  public removeAnimationDictionary(dictionary: string): void {
    vimp.natives.streaming.removeAnimDict(dictionary);
  }

  public requestNamedPtfxAsset(assetName: string): void {
    vimp.natives.streaming.requestNamedPtfxAsset(assetName);
  }

  public hasNamedPtfxAssetLoaded(assetName: string): boolean {
    return vimp.natives.streaming.hasNamedPtfxAssetLoaded(assetName);
  }

  public isModelInCdimage(model: string): boolean {
    return vimp.natives.streaming.isModelInCdimage(vimp.natives.misc.getHashKey(model));
  }

  public requestModel(modelHash: number): void {
    vimp.natives.streaming.requestModel(modelHash);
  }

  public hasModelLoaded(modelHash: number): boolean {
    return vimp.natives.streaming.hasModelLoaded(modelHash);
  }

  public requestIpl(iplName: string): void {
    vimp.natives.streaming.requestIpl(iplName);
  }

  public removeIpl(iplName: string): void {
    vimp.natives.streaming.removeIpl(iplName);
  }

  public setFocusArea(position: IVector3D, offset: IVector3D): void {
    vimp.natives.streaming.setFocusPosAndVel(position.x, position.y, position.z, offset.x, offset.y, offset.z);
  }

  public clearFocus(): void {
    vimp.natives.streaming.clearFocus();
  }

  public setFocusEntity(entityHandle: number): void {
    vimp.natives.streaming.setFocusEntity(entityHandle);
  }
}
