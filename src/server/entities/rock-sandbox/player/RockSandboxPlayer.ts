import {
  type IWeaponDamageProfile,
  type IWeaponState,
  type IPlayer,
  type ICustomization,
} from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { type IServerToClientEvents } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";
import { wrapVehicle } from "../vehicle/RockSandboxVehicle";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPlayer as NativePlayer } from "@rock-sandbox/types/server";
import { BaseObjectType } from "../../../../shared";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxPlayer extends RockSandboxEntity implements IPlayer {
  public override getNetData(name: string): unknown {
    return this._nativePlayer.getNetData(name);
  }

  public override setNetData(name: string, value: unknown): void {
    this._nativePlayer.setNetData(name, value);
  }

  private readonly _nativePlayer: NativePlayer;

  public constructor(player: NativePlayer) {
    super();
    this._nativePlayer = player;
  }

  public override get id(): number {
    return this._nativePlayer.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public override get isExists(): boolean {
    return this._nativePlayer.isExists;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativePlayer.position;
    // Rotate the engine's Y-up coordinates into rock-mod's Z-up coordinates.
    return new Vector3D(x, -z, y);
  }

  public override setPosition(value: IVector3D): void {
    this._nativePlayer.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override get dimension(): number {
    return this._nativePlayer.dimension;
  }

  public override setDimension(value: number): void {
    this._nativePlayer.setDimension(value);
  }

  public get name(): string {
    return this._nativePlayer.name;
  }

  public get socialClub(): string {
    return this._nativePlayer.profileId;
  }

  public get heading(): number {
    return this._nativePlayer.heading;
  }

  public get health(): number {
    return this._nativePlayer.health;
  }

  public get armour(): number {
    return this._nativePlayer.armour;
  }

  public get autoRespawn(): boolean {
    return this._nativePlayer.autoRespawn;
  }

  public get clientTransformEnabled(): boolean {
    return this._nativePlayer.clientTransformEnabled;
  }

  public setClientTransformEnabled(enabled: boolean): void {
    this._nativePlayer.setClientTransformEnabled(enabled);
  }

  public get collisionEnabled(): boolean {
    return this._nativePlayer.collisionEnabled;
  }

  public setCollision(enabled: boolean, keepPhysics: boolean): void {
    this._nativePlayer.setCollision(enabled, keepPhysics);
  }

  public get frozen(): boolean {
    return this._nativePlayer.frozen;
  }

  public freezePosition(frozen: boolean): void {
    this._nativePlayer.freezePosition(frozen);
  }

  public get passiveMode(): boolean {
    return this._nativePlayer.passiveMode;
  }

  public setPassiveMode(enabled: boolean): void {
    this._nativePlayer.setPassiveMode(enabled);
  }

  public get invincible(): boolean {
    return this._nativePlayer.invincible;
  }

  public setInvincible(enabled: boolean): void {
    this._nativePlayer.setInvincible(enabled);
  }

  public get collisionWithPlayers(): boolean {
    return this._nativePlayer.collisionWithPlayers;
  }

  public setCollisionWithPlayers(enabled: boolean): void {
    this._nativePlayer.setCollisionWithPlayers(enabled);
  }

  public get isDead(): boolean {
    return this._nativePlayer.isDead;
  }

  public get ip(): string {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.ip");
  }

  public get serial(): string {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.serial");
  }

  public get vehicle(): IVehicle | null {
    const vehicle = this._nativePlayer.vehicle;
    return vehicle === null ? null : wrapVehicle(vehicle);
  }

  public get seat(): number {
    return this._nativePlayer.seat;
  }

  public get weapon(): number {
    return this._nativePlayer.weapon;
  }

  public get weaponAmmo(): number {
    return this._nativePlayer.weaponAmmo;
  }

  public get eyeColor(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.eyeColor");
  }

  public get streamedPlayers(): IPlayer[] {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.streamedPlayers");
  }

  public emitEvent<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    this._nativePlayer.emitEvent<string>(eventName, ...args);
  }

  public emitRPC<K extends keyof IClientRPCList>(
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.emitRPC");
  }

  public spawn(position: IVector3D): void {
    this._nativePlayer.spawn({ x: position.x, y: position.z, z: -position.y });
  }

  public setName(name: string): void {
    this._nativePlayer.setName(name);
  }

  public setHeading(value: number): void {
    this._nativePlayer.setHeading(value);
  }

  public setAutoRespawn(enabled: boolean): void {
    this._nativePlayer.setAutoRespawn(enabled);
  }

  public setHealth(value: number): void {
    this._nativePlayer.setHealth(value);
  }

  public setArmour(value: number): void {
    this._nativePlayer.setArmour(value);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    this._nativePlayer.setWeaponAmmo(weapon, ammo);
  }

  public equipWeapon(weapon: string, ammo: number, damage?: IWeaponDamageProfile): bigint {
    return this._nativePlayer.equipWeapon(weapon, ammo, damage);
  }

  public addWeaponAmmo(weapon: string, ammo: number, revision: bigint): void {
    this._nativePlayer.addWeaponAmmo(weapon, ammo, revision);
  }

  public getWeaponState(weapon: string): IWeaponState {
    return this._nativePlayer.getWeaponState(weapon);
  }

  public giveWeapon(weapon: string, ammo: number): void {
    this._nativePlayer.giveWeapon(weapon, ammo);
  }

  public removeWeapon(weapon: string): void {
    this._nativePlayer.removeWeapon(weapon);
  }

  public enableVoiceTo(_player: IPlayer): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.enableVoiceTo");
  }

  public disableVoiceTo(_player: IPlayer): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.disableVoiceTo");
  }

  public putIntoVehicle(_vehicle: IVehicle, _seat?: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.putIntoVehicle");
  }

  public ejectFromVehicle(): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.ejectFromVehicle");
  }

  public setCustomization(_data: ICustomization): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setCustomization");
  }

  public setHeadOverlay(
    _overlayID: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setHeadOverlay");
  }

  public setEyeColor(_colorID: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setEyeColor");
  }

  public setProp(_propID: number, _drawableID: number, _textureID: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setProp");
  }

  public setClothes(_componentID: number, _drawableID: number, _textureID: number, _paletteID: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setClothes");
  }

  public setHairColor(_colorID: number, _highlightColorID: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setHairColor");
  }

  public kick(reason?: string): void {
    this._nativePlayer.kick(reason);
  }

  public playAnimation(_dictionary: string, _name: string, _speed: number, _flag: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.playAnimation");
  }

  public stopAnimation(): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.stopAnimation");
  }

  public removeFromVehicle(): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.removeFromVehicle");
  }
}

const wrappers = new WeakMap<NativePlayer, RockSandboxPlayer>();

export function wrapPlayer(player: NativePlayer): RockSandboxPlayer {
  const existing = wrappers.get(player);
  if (existing) return existing;
  const wrapper = new RockSandboxPlayer(player);
  wrappers.set(player, wrapper);
  return wrapper;
}
