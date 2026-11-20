/// <reference types="@vimp-mp/types/client" />

import { type ILocalPlayerManager } from "@RockMod/client/game";

export class VIMPLocalPlayerManager implements ILocalPlayerManager {
  public setRunSprintMultiplierFor(value: number): void {
    vimp.natives.player.setRunSprintMultiplierForPlayer(vimp.natives.player.playerId(), value);
  }

  public setSwimMultiplierFor(value: number): void {
    vimp.natives.player.setSwimMultiplierForPlayer(vimp.natives.player.playerId(), value);
  }
}
