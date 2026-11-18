/// <reference types="@vimp-mp/types/client" />

import { type IWeaponManager } from "@RockMod/client/game";

export class VIMPWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return vimp.natives.weapon.getWeaponClipSize(weapon);
  }

  public setNoAutoReload(enabled: boolean): boolean {
    const game = vimp.game;
    if (!game || typeof game.setWeaponsNoAutoReload !== "function") return !enabled;
    return game.setWeaponsNoAutoReload(enabled);
  }

  public setNoAutoSwap(enabled: boolean): boolean {
    const game = vimp.game;
    if (!game || typeof game.setWeaponsNoAutoSwap !== "function") return !enabled;
    return game.setWeaponsNoAutoSwap(enabled);
  }
}
