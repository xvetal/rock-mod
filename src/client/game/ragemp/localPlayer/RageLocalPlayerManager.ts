import { type ILocalPlayerManager } from "@RockMod/client/game";

export class RageLocalPlayerManager implements ILocalPlayerManager {
  public setRunSprintMultiplierFor(value: number): void {
    mp.game.player.setRunSprintMultiplierFor(value);
  }

  public setSwimMultiplierFor(value: number): void {
    mp.game.player.setSwimMultiplierFor(value);
  }
}
