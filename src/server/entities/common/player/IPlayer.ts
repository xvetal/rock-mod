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
  /** Published automatic respawn policy; unsupported platforms throw. */
  get autoRespawn(): boolean;
  /** Published player-vs-player collision policy; unsupported platforms throw. */
  get collisionWithPlayers(): boolean;
  /** Host-owned combat protection; unsupported platforms throw. */
  get invincible(): boolean;
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
  /** Queue a policy change. Unsupported platforms throw synchronously. */
  setAutoRespawn(enabled: boolean): void;
  /** Queue a player collision policy change. Unsupported platforms throw. */
  setCollisionWithPlayers(enabled: boolean): void;
  setInvincible(enabled: boolean): void;
  freezePosition(frozen: boolean): void;
  setArmour(value: number): void;
  setWeaponAmmo(weapon: string, ammo: number): void;
  giveWeapon(weapon: string, ammo: number): void;
  removeWeapon(weapon: string): void;
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
