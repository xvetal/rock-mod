/// <reference types="@vimp-mp/types/client" />

import { type IWeaponManager } from "@RockMod/client/game";

export class VIMPWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return vimp.natives.weapon.getWeaponClipSize(weapon);
  }
}
