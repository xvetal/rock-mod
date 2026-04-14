import { type INativeCallerManager } from "@RockMod/client/game";

export class RageNativeCallerManager implements INativeCallerManager {
  public callNative(hash: string, ...args: unknown[]): unknown {
    return mp.game.invoke(hash, args);
  }
}
