import { type IWeaponManager } from "../../common/weapon/IWeaponManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return getRockSandbox().weapons.getClipSize(weapon);
  }
}
