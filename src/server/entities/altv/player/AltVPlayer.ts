import { AltVEntity, IAltVEntityOptions } from "../entity/AltVEntity";
import { ICustomization, IPlayer } from "../../common/player/IPlayer";
import { AltVVehicle } from "../vehicle/AltVVehicle";
import { RockMod } from "../../../RockMod";
import Player = AltVServer.Player;
import Vehicle = AltVServer.Vehicle;
import Vector3 = AltVShared.Vector3;
import hash = AltVShared.hash;
import { Vector3D } from "../../../common/utils/math/Vectors";
import { IAltVClientEvents } from "../../../net/altv/events/AltVEventsManager";
import { IAltVClientRPC } from "../../../net/altv/rpc/AltVRPCManager";

interface AltVPlayerOptions extends IAltVEntityOptions<Player> {}

export class AltVPlayer extends AltVEntity<Player> implements IPlayer {
  public get name(): string {
    return this.mpEntity.name;
  }

  public get socialClub(): string {
    return this.mpEntity.socialClubName;
  }

  public get heading(): number {
    return this.mpEntity.headRot.z;
  }

  public get health(): number {
    return this.mpEntity.health;
  }

  public get armour(): number {
    return this.mpEntity.armour;
  }

  public get ip(): string {
    return this.mpEntity.ip;
  }

  public get serial(): string {
    return this.mpEntity.hwidHash;
  }

  public get vehicle(): AltVVehicle | null {
    const mpVehicle = this.mpEntity.vehicle;
    if (!mpVehicle) {
      return null;
    }

    return RockMod.instance.vehicles.getByID(mpVehicle.id) as AltVVehicle;
  }

  public get seat(): number {
    return this.mpEntity.seat;
  }

  public get weapon(): number {
    return this.mpEntity.currentWeapon;
  }

  public get weaponAmmo(): number {
    return this.mpEntity.getAmmo(this.weapon);
  }

  public get eyeColor(): number {
    return this.mpEntity.getEyeColor();
  }

  public get streamedPlayers(): AltVPlayer[] {
    const players: AltVPlayer[] = [];

    for (const { entity } of this.mpEntity.streamedEntities) {
      if (entity instanceof Player) {
        players.push(RockMod.instance.players.getByID(entity.id) as AltVPlayer);
      }
    }

    return players;
  }

  public constructor(options: AltVPlayerOptions) {
    super(options);
  }

  public emitEvent<K extends keyof IAltVClientEvents>(eventName: K, ...args: Parameters<IAltVClientEvents[K]>): void {
    return RockMod.instance.net.events.emitClient(this, eventName, ...args);
  }

  public emitRPC<K extends keyof IAltVClientRPC>(
    rpcName: K,
    ...args: Parameters<IAltVClientRPC[K]>
  ): Promise<ReturnType<IAltVClientRPC[K]>> {
    return RockMod.instance.net.rpc.emitClient(this, rpcName, ...args);
  }

  public spawn(position: Vector3D): void {
    return this.mpEntity.spawn(position);
  }

  public setName(name: string): void {
    throw new Error(`Not implemented (setName: ${name})`);
  }

  public setHeading(value: number): void {
    this.mpEntity.rot = new Vector3(0, 0, value);
  }

  public setHealth(value: number): void {
    this.mpEntity.health = Math.clamp(value, 0, 100);
  }

  public setArmour(value: number): void {
    this.mpEntity.armour = Math.clamp(value, 0, 100);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    return this.mpEntity.setWeaponAmmo(weapon, ammo);
  }

  public giveWeapon(weapon: string, ammo: number): void {
    return this.mpEntity.giveWeapon(weapon, ammo, true);
  }

  public removeWeapon(weapon: string): void {
    return this.mpEntity.removeWeapon(hash(weapon));
  }

  public enableVoiceTo(player: AltVPlayer): void {
    throw new Error(`Not implemented (enableVoiceTo: ${this.id} -> ${player.id})`);
  }

  public disableVoiceTo(player: AltVPlayer): void {
    throw new Error(`Not implemented (disableVoiceTo: ${this.id} -> ${player.id})`);
  }

  public putIntoVehicle(vehicle: AltVVehicle, seat?: number): void {
    const mpVehicle = Vehicle.getByID(vehicle.id);

    if (!mpVehicle) {
      throw new Error(`Multiplayer vehicle with id ${vehicle.id} not found`);
    }

    return this.mpEntity.setIntoVehicle(mpVehicle, seat ?? 0);
  }

  public ejectFromVehicle(): void {
    return this.mpEntity.clearTasks();
  }

  public setCustomization(data: Partial<ICustomization>): void {
    throw new Error(`Not implemented (setCustomization: ${data})`);
  }

  public setHeadOverlay(
    overlayID: number,
    index: number,
    opacity: number,
    firstColor: number,
    secondColor: number,
  ): void {
    this.mpEntity.setHeadOverlayColor(overlayID, 1, firstColor, secondColor);
    this.mpEntity.setHeadOverlay(overlayID, index, opacity);
  }

  public setEyeColor(colorID: number): void {
    this.mpEntity.setEyeColor(colorID);
  }

  public setProp(propID: number, drawableID: number, textureID: number): void {
    this.mpEntity.setProp(propID, drawableID, textureID);
  }

  public setClothes(componentID: number, drawableID: number, textureID: number, paletteID: number): void {
    this.mpEntity.setClothes(componentID, drawableID, textureID, paletteID);
  }

  public setHairColor(colorID: number, highlightColorID: number): void {
    this.mpEntity.setHairColor(colorID);
    this.mpEntity.setHairHighlightColor(highlightColorID);
  }

  public kick(reason?: string): void {
    return this.mpEntity.kick(reason);
  }
}
