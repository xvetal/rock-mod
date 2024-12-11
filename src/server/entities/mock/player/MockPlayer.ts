import { IPlayer } from "../../common/player/IPlayer";
import { MockEntity, IMockEntityOptions } from "../entity/MockEntity";
import { Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { RockMod } from "../../../RockMod";
import { RageVehicle } from "../../ragemp/vehicle/RageVehicle";
import { IMockClientEvents } from "../../../net/mock/events/MockEventsManager";
import { IMockClientRPC } from "../../../net/mock/rpc/MockRPCManager";

export interface IMockPlayerOptions extends IMockEntityOptions {
  name?: string;
  socialClub?: string;
  health?: number;
  heading?: number;
  armour?: number;
  weapon?: number;
  weaponAmmo?: number;
  ip?: string;
  serial?: string;
}

interface IMockPlayerData {
  name: string;
  socialClub: string;
  heading: number;
  health: number;
  armour: number;
  weapon: number;
  weaponAmmo: number;
  ip: string;
  serial: string;
}

export class MockPlayer extends MockEntity implements IPlayer {
  private readonly _playerData: IMockPlayerData;

  public get name(): string {
    return this._playerData.name;
  }

  public get socialClub(): string {
    return this._playerData.socialClub;
  }

  public get heading(): number {
    return this._playerData.heading;
  }

  public get health(): number {
    return this._playerData.health;
  }

  public get armour(): number {
    return this._playerData.armour;
  }

  public get isDead(): boolean {
    return this.health <= 0;
  }

  public get ip(): string {
    return this._playerData.ip;
  }

  public get serial(): string {
    return this._playerData.serial;
  }

  public get vehicle(): null {
    return null;
  }

  public get seat(): number {
    return -1;
  }

  public get weapon(): number {
    return this._playerData.weapon;
  }

  public get weaponAmmo(): number {
    return this._playerData.weaponAmmo;
  }

  public get eyeColor(): number {
    return 0;
  }

  public get streamedPlayers(): MockPlayer[] {
    return [];
  }

  public constructor(options: IMockPlayerOptions) {
    super(options);

    const {
      name = "Mock Player",
      socialClub = "mock_club",
      health = 100,
      heading = 0,
      armour = 0,
      weapon = 0,
      weaponAmmo = 0,
      ip = "127.0.0.1",
      serial = "mock_serial",
    } = options;

    this._playerData = {
      name,
      socialClub,
      health,
      heading,
      armour,
      weapon,
      weaponAmmo,
      ip,
      serial,
    };
  }

  public emitEvent<K extends keyof IMockClientEvents>(eventName: K, ...args: Parameters<IMockClientEvents[K]>): void {
    return RockMod.instance.net.events.emitClient(this, eventName, ...args);
  }

  public emitRPC<K extends keyof IMockClientRPC>(
    rpcName: K,
    ...args: Parameters<IMockClientRPC[K]>
  ): Promise<ReturnType<IMockClientRPC[K]>> {
    return RockMod.instance.net.rpc.emitClient(this, rpcName, ...args);
  }

  public spawn(position: Vector3D): void {
    this.setPosition(position);
    this._playerData.health = 100;
  }

  public setName(name: string): void {
    this._playerData.name = name;
  }

  public setHeading(value: number): void {
    this._playerData.heading = value;
  }

  public setHealth(value: number): void {
    this._playerData.health = Math.clamp(value, 0, 100);
  }

  public setArmour(value: number): void {
    this._playerData.armour = Math.clamp(value, 0, 100);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    this._playerData.weapon = RockMod.instance.utils.hash(weapon);
    this._playerData.weaponAmmo = ammo;
  }

  public giveWeapon(weapon: string, ammo: number): void {
    this.setWeaponAmmo(weapon, ammo);
  }

  public removeWeapon(weapon: string): void {
    if (this._playerData.weapon === RockMod.instance.utils.hash(weapon)) {
      this._playerData.weapon = 0;
      this._playerData.weaponAmmo = 0;
    }
  }

  public enableVoiceTo(player: MockPlayer): void {
    throw new Error(`${player.name}: Not implemented: enableVoiceTo`);
  }

  public disableVoiceTo(player: MockPlayer): void {
    throw new Error(`${player.name}: Not implemented: disableVoiceTo`);
  }

  public putIntoVehicle(vehicle: RageVehicle, seat?: number): void {
    throw new Error(`${this.name}: ${vehicle.id} ${seat} putIntoVehicle`);
  }

  public ejectFromVehicle(): void {
    throw new Error("Not implemented: ejectFromVehicle");
  }

  public setCustomization(): void {
    throw new Error("Not implemented: setCustomization");
  }

  public setHeadOverlay(): void {
    throw new Error("Not implemented: setHeadOverlay");
  }

  public setEyeColor(): void {
    throw new Error("Not implemented: setEyeColor");
  }

  public setProp(): void {
    throw new Error("Not implemented: setProp");
  }

  public setClothes(): void {
    throw new Error("Not implemented: setClothes");
  }

  public setHairColor(): void {
    throw new Error("Not implemented: setHairColor");
  }

  public kick(): void {
    throw new Error("Not implemented: kick");
  }
}
