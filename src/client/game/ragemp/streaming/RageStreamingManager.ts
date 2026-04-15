import { type IStreamingManager } from "@RockMod/client/game";

export class RageStreamingManager implements IStreamingManager {
  public requestAnimationDictionary(dictionary: string): void {
    mp.game.streaming.requestAnimDict(dictionary);
  }

  public hasAnimationDictionaryLoaded(dictionary: string): boolean {
    return mp.game.streaming.hasAnimDictLoaded(dictionary);
  }

  public isModelInCdimage(model: string): boolean {
    const modelHash = mp.game.joaat(model);
    return mp.game.streaming.isModelInCdimage(modelHash);
  }

  public requestIpl(iplName: string): void {
    mp.game.streaming.requestIpl(iplName);
  }

  public removeIpl(iplName: string): void {
    mp.game.streaming.removeIpl(iplName);
  }
}
