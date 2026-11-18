import type { Player as VimpPlayer } from "@vimp-mp/types/server";
import { type IServerCombatCapabilities } from "../../../capabilities/ICapabilities";

let detected: IServerCombatCapabilities | null = null;

/** Reads the server's combat API from a player object; the result is the same for every player. */
export function detectVIMPCombatCapabilities(player: VimpPlayer): IServerCombatCapabilities {
  if (detected) return detected;
  detected = Object.freeze({
    weaponAmmo: typeof player.getWeaponAmmo === "function",
    weaponClip: typeof player.getWeaponClip === "function" && typeof player.setWeaponClip === "function",
    currentWeapon: typeof player.setCurrentWeapon === "function",
    weaponComponents:
      typeof player.giveWeaponComponent === "function" && typeof player.removeWeaponComponent === "function",
    healthRecharge: "healthRecharge" in player,
    invincible: "invincible" in player,
    autoRespawn: "autoRespawn" in player,
    // The damage and shot events came with the same protocol as the per-player combat members.
    damageRequest: "healthRecharge" in player,
    weaponShot: false,
    weaponShotCheck: "healthRecharge" in player,
  });
  return detected;
}

/** `null` until a player has connected: the server exposes no API version without one. */
export function getVIMPCombatCapabilities(): IServerCombatCapabilities | null {
  if (detected) return detected;
  const player = vimp.players.all[0];
  return player ? detectVIMPCombatCapabilities(player) : null;
}
