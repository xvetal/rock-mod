import { type IWeaponManager } from "@RockMod/client/game";

export class RageWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return mp.game.weapon.getWeaponClipSize(weapon);
  }
}
