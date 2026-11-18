import { type IWeaponManager } from "../../common/weapon/IWeaponManager";
import { getRockSandbox } from "../../../internal/getRockSandbox";

export class RockSandboxWeaponManager implements IWeaponManager {
  public getWeaponClipSize(weapon: number): number {
    return getRockSandbox().weapons.getClipSize(weapon);
  }

  /** RockSandbox has no such switch: enabling is refused. */
  public setNoAutoReload(enabled: boolean): boolean {
    return !enabled;
  }

  /** RockSandbox has no such switch: enabling is refused. */
  public setNoAutoSwap(enabled: boolean): boolean {
    return !enabled;
  }
}
