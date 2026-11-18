import { type IEntity, type IEntityOptions } from "../entity/IEntity";
import { type IVehicle } from "../vehicle/IVehicle";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { type IServerToClientEvents } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";

export interface ICustomization {
  gender: boolean;
  shapeFirst: number;
  shapeSecond: number;
  shapeThird: number;
  skinFirst: number;
  skinSecond: number;
  skinThird: number;
  shapeMix: number;
  skinMix: number;
  thirdMix: number;
  eyeColor: number;
  hairColor: number;
  highlightColor: number;
  faceFeatures: number[];
}

export interface IPlayerOptions extends IEntityOptions {}

export interface IWeaponDamageProfile {
  readonly baseDamage: number;
  readonly maxRange: number;
  readonly minHitIntervalMs: number;
  readonly armorPenetration: number;
  readonly multipliers: Readonly<{ torso: number; head: number; arms: number; legs: number }>;
}

export interface IWeaponState {
  readonly weapon: number;
  readonly ammoInClip: number;
  readonly ammo: number;
  readonly capacity: number;
  readonly owned: boolean;
  readonly revision: bigint;
}

export interface IPlayer extends IEntity {
  /** Native authoritative inventory operations. Unsupported backends throw. */
  equipWeapon(weapon: string, ammo: number, damage?: IWeaponDamageProfile): bigint;
  addWeaponAmmo(weapon: string, ammo: number, revision: bigint): void;
  getWeaponState(weapon: string): IWeaponState;
  get name(): string;
  get socialClub(): string;
  get heading(): number;
  get health(): number;
  get armour(): number;
  get isDead(): boolean;
  /** Automatic respawn policy. Throws on RAGE, alt:V and Mock: check `capabilities.combat.autoRespawn` first. */
  get autoRespawn(): boolean;
  /** Published player-vs-player collision policy; unsupported platforms throw. */
  get collisionWithPlayers(): boolean;
  /** Server-side damage protection. Throws on RAGE, alt:V and Mock: check `capabilities.combat.invincible` first. */
  get invincible(): boolean;
  /** Health regeneration multiplier (`0` turns it off), or `null` where the server does not control it. */
  get healthRecharge(): number | null;
  get passiveMode(): boolean;
  setPassiveMode(enabled: boolean): void;
  /** Published host locomotion lock; unsupported platforms throw. */
  get clientTransformEnabled(): boolean;
  setClientTransformEnabled(enabled: boolean): void;
  get collisionEnabled(): boolean;
  setCollision(enabled: boolean, keepPhysics: boolean): void;
  get frozen(): boolean;
  get ip(): string;
  get serial(): string;
  get vehicle(): IVehicle | null;
  get seat(): number;
  get weapon(): number;
  get weaponAmmo(): number;
  get eyeColor(): number;
  get streamedPlayers(): IPlayer[];
  emitEvent<K extends keyof IServerToClientEvents>(eventName: K, ...args: Parameters<IServerToClientEvents[K]>): void;
  emitRPC<K extends keyof IClientRPCList>(
    rpcName: K,
    ...args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>>;
  spawn(position: IVector3D): void;
  setName(name: string): void;
  setHeading(value: number): void;
  setHealth(value: number): void;
  /**
   * Queue a respawn policy change. Throws on RAGE, alt:V and Mock and does nothing on VIMP without
   * the combat API: call only when `capabilities.combat.autoRespawn` is `true`.
   */
  setAutoRespawn(enabled: boolean): void;
  /** Queue a player collision policy change. Unsupported platforms throw. */
  setCollisionWithPlayers(enabled: boolean): void;
  /**
   * Blocks all damage to the player on the server. Throws on RAGE, alt:V and Mock and does nothing
   * on VIMP without the combat API: call only when `capabilities.combat.invincible` is `true`.
   */
  setInvincible(enabled: boolean): void;
  freezePosition(frozen: boolean): void;
  setArmour(value: number): void;
  /** Sets the exact total ammunition of the weapon (clip included); it does not add to the current amount. */
  setWeaponAmmo(weapon: string, ammo: number): void;
  giveWeapon(weapon: string, ammo: number): void;
  removeWeapon(weapon: string): void;
  /**
   * Total ammunition of an owned weapon (clip included), or `null` when it is not owned or the
   * platform does not report it. Weapons are names (`"weapon_pistol"`) or hashes.
   */
  getWeaponAmmo(weapon: string | number): number | null;
  /** Rounds in the clip of an owned weapon, or `null` when it is not owned or the platform does not report it. */
  getWeaponClip(weapon: string | number): number | null;
  /**
   * Sets the rounds in the clip of an owned weapon, never above its total ammunition; the total does
   * not change. `false` when it is not owned or the platform cannot do it.
   */
  setWeaponClip(weapon: string | number, clip: number): boolean;
  /** Puts an owned weapon in hand; `false` when it is not owned or the platform cannot do it. */
  setCurrentWeapon(weapon: string | number): boolean;
  /** Attaches a component (`"COMPONENT_..."` or hash) to an owned weapon; `false` when not applied. */
  giveWeaponComponent(weapon: string | number, component: string | number): boolean;
  /** Detaches a component from an owned weapon; `false` when not applied. */
  removeWeaponComponent(weapon: string | number, component: string | number): boolean;
  /** Sets the health regeneration multiplier (finite, `>= 0`); `false` when not applied. */
  setHealthRecharge(multiplier: number): boolean;
  enableVoiceTo(player: IPlayer): void;
  disableVoiceTo(player: IPlayer): void;
  putIntoVehicle(vehicle: IVehicle, seat?: number): void;
  ejectFromVehicle(): void;
  setCustomization(data: ICustomization): void;
  setHeadOverlay(overlayID: number, index: number, opacity: number, firstColor: number, secondColor: number): void;
  setEyeColor(colorID: number): void;
  setProp(propID: number, drawableID: number, textureID: number): void;
  setClothes(componentID: number, drawableID: number, textureID: number, paletteID: number): void;
  setHairColor(colorID: number, highlightColorID: number): void;
  kick(reason?: string): void;
  playAnimation(dictionary: string, name: string, speed: number, flag: number): void;
  stopAnimation(): void;
  removeFromVehicle(): void;
}
