import { type IBaseObject, type IColshape, type IPlayer, type IVehicle } from "../../../entities";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";

/** Frozen final values in SDK coordinates, supplied by platforms with historical exit state. */
export interface IPlayerQuitSnapshot {
  readonly id: number;
  readonly health: number;
  readonly weaponAmmo: number;
  readonly position: Readonly<Pick<IVector3D, "x" | "y" | "z">>;
  readonly heading: number;
  readonly dimension: number;
}

export interface IPlayerDamageContext {
  readonly weapon: number;
  readonly revision: bigint;
  readonly request: bigint;
  readonly life: bigint;
  readonly attackerLife: bigint;
  readonly tick: bigint;
  readonly previousHealth: number;
  readonly health: number;
  readonly healthLoss: number;
  readonly previousArmour: number;
  readonly armour: number;
  readonly armourLoss: number;
  readonly totalDamage: number;
  readonly baseDamage: number;
  readonly multiplier: number;
  readonly hits: Readonly<{ torso: number; head: number; arms: number; legs: number }>;
}

/** Fields beyond `weapon` and `ammoInClip` are filled only by the platforms that know them. */
export interface IPlayerWeaponShot {
  readonly weapon: number;
  /** Rounds left in the clip right after the shot, or `null` when unknown. */
  readonly ammoInClip: number | null;
  /** VIMP: the platform accepted the shot and calculated its damage. */
  readonly accepted?: boolean;
  /** VIMP: why no damage was calculated, `null` when accepted. */
  readonly rejection?: string | null;
  readonly ammo?: number;
  readonly revision?: bigint;
  readonly request?: bigint;
  readonly life?: bigint;
  readonly tick?: bigint;
}

export type PlayerDamageCause =
  | "weapon"
  | "melee"
  | "explosion"
  | "fall"
  | "fire"
  | "drown"
  | "vehicle"
  | "npc"
  | "other";

/**
 * Damage about to be applied to a player. Answer synchronously: `cancel()` or `setDamage()`
 * called after the handler returned (for example after an `await`) is ignored.
 */
export interface IPlayerDamageRequest {
  /** Player who caused the damage, or `null` for the environment, NPCs or self-inflicted damage. */
  readonly attacker: IPlayer | null;
  /** Weapon hash the damage is attributed to, or `null` when unknown. */
  readonly weapon: number | null;
  readonly cause: PlayerDamageCause;
  /** Bone id of the first hit, or `null` when unknown. */
  readonly bone: number | null;
  /** Metres between attacker and victim, or `null` without an attacker. */
  readonly distance: number | null;
  /** Pellets of one shot that hit the victim; 1 otherwise. */
  readonly hits: number;
  /** Health the victim will lose (0-100), including the answer of earlier handlers. */
  readonly health: number;
  /** Armour the victim will lose (0-100). */
  readonly armour: number;
  /** The loss kills the victim. */
  readonly lethal: boolean;
  /** `health` and `armour` are the platform's best estimate. */
  readonly estimated: boolean;
  readonly cancelled: boolean;
  /** Applies no damage at all. */
  cancel(): void;
  /** Replaces the amounts to apply, clamped to 0-100; `armour` defaults to 0. */
  setDamage(health: number, armour?: number): void;
}

export enum ServerInternalEventName {
  PlayerWeaponShot = "rm::playerWeaponShot",
  PlayerConnected = "rm::playerConnected",
  PlayerDisconnected = "rm::playerDisconnected",
  PlayerQuit = "rm::playerQuit",
  PlayerDeath = "rm::playerDeath",
  PlayerDamage = "rm::playerDamage",
  PlayerDamageRequest = "rm::playerDamageRequest",
  PlayerEnterVehicle = "rm::playerEnterVehicle",
  PlayerExitVehicle = "rm::playerExitVehicle",
  PlayerEnteredColshape = "rm::playerEnteredColshape",
  PlayerLeftColshape = "rm::playerLeftColshape",
  PlayerDimensionChange = "rm::playerDimensionChange",
  EntityCreated = "rm::entityCreated",
  EntityDestroyed = "rm::entityDestroyed",
}

export interface IServerInternalEvents {
  /** Fires only on platforms with `capabilities.combat.weaponShot`; on VIMP for weapons the server gave. */
  [ServerInternalEventName.PlayerWeaponShot]: (player: IPlayer, context: IPlayerWeaponShot) => void;
  [ServerInternalEventName.PlayerConnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerDisconnected]: (player: IPlayer) => void;
  [ServerInternalEventName.PlayerQuit]: (
    player: IPlayer,
    exitType: string,
    reason: string,
    snapshot?: IPlayerQuitSnapshot,
  ) => void;
  [ServerInternalEventName.PlayerDeath]: (player: IPlayer, reason: number, killer: IPlayer | null) => void;
  [ServerInternalEventName.PlayerDamage]: (
    player: IPlayer,
    healthLoss: number,
    armourLoss: number,
    attacker?: IPlayer | null,
    context?: IPlayerDamageContext,
  ) => void;
  /**
   * Fires before damage is applied, only on platforms with `capabilities.combat.damageRequest`.
   * The platform may delay damage while this event has listeners, so subscribe only when needed.
   */
  [ServerInternalEventName.PlayerDamageRequest]: (victim: IPlayer, request: IPlayerDamageRequest) => void;
  [ServerInternalEventName.PlayerEnterVehicle]: (player: IPlayer, vehicle: IVehicle, seat: number) => void;
  [ServerInternalEventName.PlayerExitVehicle]: (player: IPlayer, vehicle: IVehicle) => void;
  [ServerInternalEventName.PlayerEnteredColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.PlayerLeftColshape]: (player: IPlayer, colshape: IColshape) => void;
  [ServerInternalEventName.PlayerDimensionChange]: (
    player: IPlayer,
    oldDimension: number,
    newDimension: number,
  ) => void;
  [ServerInternalEventName.EntityCreated]: (object: IBaseObject) => void;
  [ServerInternalEventName.EntityDestroyed]: (object: IBaseObject) => void;
}
