/// <reference types="@classic-mp/types/client" />

import { type IWeaponManager } from "@RockMod/client/game";

export class CCMPWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return ccmp.natives.weapon.getWeaponClipSize(weapon);
  }
}
