export interface IKeysManager {
  isDown(key: number): boolean;
  isUp(key: number): boolean;
  bind(key: number, keyHold: boolean, handler: () => void): void;
  unbind(key: number, keyHold: boolean, handler?: () => void): void;
}
