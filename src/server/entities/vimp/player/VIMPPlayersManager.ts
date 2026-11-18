import { type IPlayersManager } from "../../common/player/IPlayersManager";
import { VIMPEntitiesManager } from "../entity/VIMPEntitiesManager";
import { VIMPPlayer } from "./VIMPPlayer";
import { type VIMPNetManager } from "../../../net/vimp/VIMPNetManager";
import { ServerInternalEventName } from "../../../net/common/events/types";
import { RockMod } from "../../../RockMod";
import { type IVIMPPlayerDeath, type VIMPPlayerDeathCause } from "../../../net/vimp/events/VIMPEventsManager";
import { asVIMPCombatPlayer, detectVIMPCombatCapabilities } from "./VIMPCombatApi";

/** GTA death-cause hashes (joaat), as RAGE reports them when no weapon is involved. */
const DEATH_CAUSE_HASH: Partial<Record<VIMPPlayerDeathCause, number>> = {
  drown: 0xff58c4fb, // WEAPON_DROWNING
  fall: 0xcdc174b0, // WEAPON_FALL
  fire: 0xdf8e89eb, // WEAPON_FIRE
  explosion: 0x2024f4e8, // WEAPON_EXPLOSION
  vehicle: 0xa36d413e, // WEAPON_RUN_OVER_BY_CAR
  melee: 0xa2719263, // WEAPON_UNARMED
};

const getDeathReason = (death: IVIMPPlayerDeath): number => {
  if (typeof death.weapon === "number") return death.weapon;
  return DEATH_CAUSE_HASH[death.cause] ?? 0;
};

export class VIMPPlayersManager extends VIMPEntitiesManager<VIMPPlayer> implements IPlayersManager {
  public constructor(net: VIMPNetManager) {
    super({
      baseObjectsType: "player",
    });
    this._init(net);
  }

  public getByName(name: string): VIMPPlayer {
    const player = this.findByName(name);

    if (!player) {
      throw new Error(`Player with name ${name} not found`);
    }

    return player;
  }

  public findByName(name: string): VIMPPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.name === name) {
        return player;
      }
    }

    return null;
  }

  public getBySocialClub(socialClub: string): VIMPPlayer {
    const player = this.findBySocialClub(socialClub);

    if (!player) {
      throw new Error(`Player with socialClub ${socialClub} not found`);
    }

    return player;
  }

  public findBySocialClub(socialClub: string): VIMPPlayer | null {
    for (const player of this.iterator.all()) {
      if (player.socialClub === socialClub) {
        return player;
      }
    }

    return null;
  }

  private _init(net: VIMPNetManager): void {
    net.events.onInternal({
      playerConnected: (vimpPlayer) => {
        // Match RAGE: the platform neither revives nor fades out the dead, the script decides (no-op without the combat API).
        detectVIMPCombatCapabilities(vimpPlayer);
        const combatPlayer = asVIMPCombatPlayer(vimpPlayer);
        if ("autoRespawn" in combatPlayer) combatPlayer.autoRespawn = false;
        if ("deathFade" in combatPlayer) combatPlayer.deathFade = false;
        const player = new VIMPPlayer({ vimpPlayer });
        this.registerBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerConnected, player);
      },
      playerDisconnected: (vimpPlayer) => {
        const player = this.getByID(vimpPlayer.id);
        net.events.emitInternal(ServerInternalEventName.PlayerQuit, player, "disconnect", "");
        this.unregisterBaseObject(player);
        net.events.emitInternal(ServerInternalEventName.PlayerDisconnected, player);
      },
      playerDeath: (vimpPlayer, death) => {
        const player = this.findByID(vimpPlayer.id);
        if (!player) return;
        const killer = death.killer ? this.findByID(death.killer.id) : null;

        net.events.emitInternal(ServerInternalEventName.PlayerDeath, player, getDeathReason(death), killer);
      },
      playerWeaponShot: (vimpPlayer, shot) => {
        const player = this.findByID(vimpPlayer.id);
        if (!player) return;

        net.events.emitInternal(
          ServerInternalEventName.PlayerWeaponShotCheck,
          player,
          Object.freeze({
            weapon: shot.weapon,
            ammoInClip: shot.clip,
            accepted: shot.accepted,
            rejection: shot.rejection,
          }),
        );
      },
      playerDimensionChange: (vimpPlayer, oldDim, newDim) => {
        const player = this.findByID(vimpPlayer.id);
        if (!player) return;
        net.events.emitInternal(ServerInternalEventName.PlayerDimensionChange, player, oldDim, newDim);
      },
      playerEnterVehicle: (vimpPlayer, vimpVehicle, seat) => {
        const player = this.findByID(vimpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(vimpVehicle.id);
        if (!player || !vehicle) return;

        net.events.emitInternal(ServerInternalEventName.PlayerEnterVehicle, player, vehicle, seat);
      },
      playerExitVehicle: (vimpPlayer, vimpVehicle) => {
        const player = this.findByID(vimpPlayer.id);
        const vehicle = RockMod.instance.vehicles.findByID(vimpVehicle.id);
        if (!player || !vehicle) return;

        net.events.emitInternal(ServerInternalEventName.PlayerExitVehicle, player, vehicle);
      },
    });
  }
}
