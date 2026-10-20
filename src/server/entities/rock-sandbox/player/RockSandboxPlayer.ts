import { type IPlayer, type ICustomization } from "../../common/player/IPlayer";
import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { type IServerToClientEvents } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";
import { type RockSandboxPlayer as NativePlayer } from "@rock-sandbox/types/server";
import { BaseObjectType } from "../../../../shared";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";

export class RockSandboxPlayer extends RockSandboxEntity implements IPlayer {
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

  public get name(): string {
    return this._nativePlayer.name;
  }

  public get socialClub(): string {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.socialClub");
  }

  public get heading(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.heading");
  }

  public get health(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.health");
  }

  public get armour(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.armour");
  }

  public get isDead(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.isDead");
  }

  public get ip(): string {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.ip");
  }

  public get serial(): string {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.serial");
  }

  public get vehicle(): IVehicle | null {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.vehicle");
  }

  public get seat(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.seat");
  }

  public get weapon(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.weapon");
  }

  public get weaponAmmo(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.weaponAmmo");
  }

  public get eyeColor(): number {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.eyeColor");
  }

  public get streamedPlayers(): IPlayer[] {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.streamedPlayers");
  }

  public emitEvent<K extends keyof IServerToClientEvents>(
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.emitEvent");
  }

  public emitRPC<K extends keyof IClientRPCList>(
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.emitRPC");
  }

  public spawn(_position: IVector3D): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.spawn");
  }

  public setName(_name: string): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setName");
  }

  public setHeading(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setHeading");
  }

  public setHealth(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setHealth");
  }

  public setArmour(_value: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setArmour");
  }

  public setWeaponAmmo(_weapon: string, _ammo: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.setWeaponAmmo");
  }

  public giveWeapon(_weapon: string, _ammo: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.giveWeapon");
  }

  public removeWeapon(_weapon: string): void {
    return rockSandboxNotImplemented("server", "RockSandboxPlayer.removeWeapon");
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
