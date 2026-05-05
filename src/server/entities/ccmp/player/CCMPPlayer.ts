import { CCMPEntity } from "../entity/CCMPEntity";
import { type ICustomization, type IPlayer } from "../../common/player/IPlayer";
import { type CCMPVehicle } from "../vehicle/CCMPVehicle";
import { type IServerToClientEvents, type Vector3D } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export class CCMPPlayer extends CCMPEntity implements IPlayer {
  public get name(): string {
    return notImplemented("CCMPPlayer.name");
  }

  public get socialClub(): string {
    return notImplemented("CCMPPlayer.socialClub");
  }

  public get heading(): number {
    return notImplemented("CCMPPlayer.heading");
  }

  public get health(): number {
    return notImplemented("CCMPPlayer.health");
  }

  public get armour(): number {
    return notImplemented("CCMPPlayer.armour");
  }

  public get isDead(): boolean {
    return notImplemented("CCMPPlayer.isDead");
  }

  public get ip(): string {
    return notImplemented("CCMPPlayer.ip");
  }

  public get serial(): string {
    return notImplemented("CCMPPlayer.serial");
  }

  public get vehicle(): CCMPVehicle | null {
    return notImplemented("CCMPPlayer.vehicle");
  }

  public get seat(): number {
    return notImplemented("CCMPPlayer.seat");
  }

  public get weapon(): number {
    return notImplemented("CCMPPlayer.weapon");
  }

  public get weaponAmmo(): number {
    return notImplemented("CCMPPlayer.weaponAmmo");
  }

  public get eyeColor(): number {
    return notImplemented("CCMPPlayer.eyeColor");
  }

  public get streamedPlayers(): CCMPPlayer[] {
    return notImplemented("CCMPPlayer.streamedPlayers");
  }

  public emitEvent<K extends keyof IServerToClientEvents>(
    _eventName: K,
    ..._args: Parameters<IServerToClientEvents[K]>
  ): void {
    notImplemented("CCMPPlayer.emitEvent");
  }

  public emitRPC<K extends keyof IClientRPCList>(
    _rpcName: K,
    ..._args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return notImplemented("CCMPPlayer.emitRPC");
  }

  public spawn(_position: Vector3D): void {
    notImplemented("CCMPPlayer.spawn");
  }

  public setName(_name: string): void {
    notImplemented("CCMPPlayer.setName");
  }

  public setHeading(_value: number): void {
    notImplemented("CCMPPlayer.setHeading");
  }

  public setHealth(_value: number): void {
    notImplemented("CCMPPlayer.setHealth");
  }

  public setArmour(_value: number): void {
    notImplemented("CCMPPlayer.setArmour");
  }

  public setWeaponAmmo(_weapon: string, _ammo: number): void {
    notImplemented("CCMPPlayer.setWeaponAmmo");
  }

  public giveWeapon(_weapon: string, _ammo: number): void {
    notImplemented("CCMPPlayer.giveWeapon");
  }

  public removeWeapon(_weapon: string): void {
    notImplemented("CCMPPlayer.removeWeapon");
  }

  public enableVoiceTo(_player: CCMPPlayer): void {
    notImplemented("CCMPPlayer.enableVoiceTo");
  }

  public disableVoiceTo(_player: CCMPPlayer): void {
    notImplemented("CCMPPlayer.disableVoiceTo");
  }

  public putIntoVehicle(_vehicle: CCMPVehicle, _seat?: number): void {
    notImplemented("CCMPPlayer.putIntoVehicle");
  }

  public ejectFromVehicle(): void {
    notImplemented("CCMPPlayer.ejectFromVehicle");
  }

  public setCustomization(_data: ICustomization): void {
    notImplemented("CCMPPlayer.setCustomization");
  }

  public setHeadOverlay(
    _overlayID: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    notImplemented("CCMPPlayer.setHeadOverlay");
  }

  public setEyeColor(_colorID: number): void {
    notImplemented("CCMPPlayer.setEyeColor");
  }

  public setProp(_propID: number, _drawableID: number, _textureID: number): void {
    notImplemented("CCMPPlayer.setProp");
  }

  public setClothes(_componentID: number, _drawableID: number, _textureID: number, _paletteID: number): void {
    notImplemented("CCMPPlayer.setClothes");
  }

  public setHairColor(_colorID: number, _highlightColorID: number): void {
    notImplemented("CCMPPlayer.setHairColor");
  }

  public kick(_reason?: string): void {
    notImplemented("CCMPPlayer.kick");
  }

  public playAnimation(_dictionary: string, _name: string, _speed: number, _flag: number): void {
    notImplemented("CCMPPlayer.playAnimation");
  }

  public stopAnimation(): void {
    notImplemented("CCMPPlayer.stopAnimation");
  }

  public removeFromVehicle(): void {
    notImplemented("CCMPPlayer.removeFromVehicle");
  }
}
