import { type IVector3D } from "@shared/common/utils";

export interface IStreamingManager {
  requestAnimationDictionary(dictionary: string): void;
  hasAnimationDictionaryLoaded(dictionary: string): boolean;
  removeAnimationDictionary(dictionary: string): void;
  isModelInCdimage(model: string): boolean;
  requestIpl(iplName: string): void;
  removeIpl(iplName: string): void;
  setFocusArea(position: IVector3D, offset: IVector3D): void;
  clearFocus(): void;
  setFocusEntity(entityHandle: number): void;
}
