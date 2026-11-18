import { type IWeaponManager } from "@RockMod/client/game";

export class RageWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return mp.game.weapon.getWeaponClipSize(weapon);
  }

  /** RAGE has no such switch: enabling is refused. */
  public setNoAutoReload(enabled: boolean): boolean {
    return !enabled;
  }

  /** RAGE has no such switch: enabling is refused. */
  public setNoAutoSwap(enabled: boolean): boolean {
    return !enabled;
  }
}
