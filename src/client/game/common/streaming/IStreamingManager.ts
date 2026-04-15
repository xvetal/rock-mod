export interface IStreamingManager {
  requestAnimationDictionary(dictionary: string): void;
  hasAnimationDictionaryLoaded(dictionary: string): boolean;
  isModelInCdimage(model: string): boolean;
  requestIpl(iplName: string): void;
  removeIpl(iplName: string): void;
}
