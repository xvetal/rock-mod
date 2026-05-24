import type {} from "@classic-mp/types/client";
import { type IStreamingManager } from "@RockMod/client/game";
import { type IVector3D } from "@shared/common/utils";

export class CCMPStreamingManager implements IStreamingManager {
  public requestAnimationDictionary(dictionary: string): void {
    ccmp.natives.streaming.requestAnimDict(dictionary);
  }

  public hasAnimationDictionaryLoaded(dictionary: string): boolean {
    return ccmp.natives.streaming.hasAnimDictLoaded(dictionary);
  }

  public removeAnimationDictionary(dictionary: string): void {
    ccmp.natives.streaming.removeAnimDict(dictionary);
  }

  public isModelInCdimage(model: string): boolean {
    return ccmp.natives.streaming.isModelInCdimage(ccmp.natives.misc.getHashKey(model));
  }

  public requestModel(modelHash: number): void {
    ccmp.natives.streaming.requestModel(modelHash);
  }

  public hasModelLoaded(modelHash: number): boolean {
    return ccmp.natives.streaming.hasModelLoaded(modelHash);
  }

  public requestIpl(iplName: string): void {
    ccmp.natives.streaming.requestIpl(iplName);
  }

  public removeIpl(iplName: string): void {
    ccmp.natives.streaming.removeIpl(iplName);
  }

  public setFocusArea(position: IVector3D, offset: IVector3D): void {
    ccmp.natives.streaming.setFocusPosAndVel(position.x, position.y, position.z, offset.x, offset.y, offset.z);
  }

  public clearFocus(): void {
    ccmp.natives.streaming.clearFocus();
  }

  public setFocusEntity(entityHandle: number): void {
    ccmp.natives.streaming.setFocusEntity(entityHandle);
  }
}
