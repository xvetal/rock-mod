import type { Player as VimpPlayer } from "@vimp-mp/types/server";
import { type IServerCombatCapabilities } from "../../../capabilities/ICapabilities";

/** Player members of the VIMP combat API, not in the published @vimp-mp/types yet; absent on servers without it. */
export interface IVIMPCombatPlayer {
  autoRespawn?: boolean;
  deathFade?: boolean;
  invincible?: boolean;
  healthRecharge?: number;
  spawn?: (position: { x: number; y: number; z: number }, heading?: number, health?: number) => boolean;
  getWeaponAmmo?: (hash: number) => number | null;
  setCurrentWeapon?: (hash: number) => boolean;
  giveWeaponComponent?: (weaponHash: number, componentHash: number) => boolean;
  removeWeaponComponent?: (weaponHash: number, componentHash: number) => boolean;
}

let detected: IServerCombatCapabilities | null = null;

export function asVIMPCombatPlayer(player: VimpPlayer): IVIMPCombatPlayer {
  return player as unknown as IVIMPCombatPlayer;
}

/** Reads the server's combat API from a player object; the result is the same for every player. */
export function detectVIMPCombatCapabilities(player: VimpPlayer): IServerCombatCapabilities {
  if (detected) return detected;
  const combat = asVIMPCombatPlayer(player);
  detected = Object.freeze({
    weaponAmmo: typeof combat.getWeaponAmmo === "function",
    currentWeapon: typeof combat.setCurrentWeapon === "function",
    weaponComponents:
      typeof combat.giveWeaponComponent === "function" && typeof combat.removeWeaponComponent === "function",
    healthRecharge: "healthRecharge" in combat,
    invincible: "invincible" in combat,
    autoRespawn: "autoRespawn" in combat,
    // The damage and shot events came with the same protocol as the per-player combat members.
    damageRequest: "healthRecharge" in combat,
    weaponShot: "healthRecharge" in combat,
  });
  return detected;
}

/** `null` until a player has connected: the server exposes no API version without one. */
export function getVIMPCombatCapabilities(): IServerCombatCapabilities | null {
  if (detected) return detected;
  const player = vimp.players.all[0];
  return player ? detectVIMPCombatCapabilities(player) : null;
}
