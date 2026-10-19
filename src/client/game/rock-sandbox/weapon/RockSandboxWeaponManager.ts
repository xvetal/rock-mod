import { type IWeaponManager } from "../../common/weapon/IWeaponManager";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxWeaponManager implements IWeaponManager {
  public getWeaponClipSize(_weapon: number): number {
    return rockSandboxNotImplemented("client", "RockSandboxWeaponManager.getWeaponClipSize");
  }
}
