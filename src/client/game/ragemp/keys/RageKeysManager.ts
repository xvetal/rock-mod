import { type IKeysManager } from "@RockMod/client/game";

export class RageKeysManager implements IKeysManager {
  public isDown(key: number): boolean {
    return mp.keys.isDown(key);
  }

  public isUp(key: number): boolean {
    return mp.keys.isUp(key);
  }

  public bind(key: number, keyHold: boolean, handler: () => void): void {
    mp.keys.bind(key, keyHold, handler);
  }

  public unbind(key: number, keyHold: boolean, handler?: () => void): void {
    mp.keys.unbind(key, keyHold, handler);
  }
}
