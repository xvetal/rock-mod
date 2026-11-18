/// <reference types="@vimp-mp/types/client" />

import { type IWeaponManager } from "@RockMod/client/game";

/** `vimp.game` switches of the VIMP combat API, not in the published @vimp-mp/types yet. */
interface IVIMPGameSwitches {
  setWeaponsNoAutoReload?: (enabled: boolean) => boolean;
  setWeaponsNoAutoSwap?: (enabled: boolean) => boolean;
}

export const getVIMPGameSwitches = (): IVIMPGameSwitches | null =>
  (vimp as unknown as { game?: IVIMPGameSwitches }).game ?? null;

export class VIMPWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return vimp.natives.weapon.getWeaponClipSize(weapon);
  }

  public setNoAutoReload(enabled: boolean): boolean {
    const game = getVIMPGameSwitches();
    if (!game || typeof game.setWeaponsNoAutoReload !== "function") return !enabled;
    return game.setWeaponsNoAutoReload(enabled);
  }

  public setNoAutoSwap(enabled: boolean): boolean {
    const game = getVIMPGameSwitches();
    if (!game || typeof game.setWeaponsNoAutoSwap !== "function") return !enabled;
    return game.setWeaponsNoAutoSwap(enabled);
  }
}
