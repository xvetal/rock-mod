import { IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { ICustomization, IPlayer } from "../../common/player/IPlayer";
import { RockMod } from "../../../RockMod";
import { RageVehicle } from "../vehicle/RageVehicle";
import { Vector3D } from "../../../common/utils/math/Vectors";
import { IRageClientEvents } from "../../../net/ragemp/events/RageEventsManager";
import { IRageClientRPC } from "../../../net/ragemp/rpc/RageRPCManager";

interface IRagePlayerOptions extends IRageEntityOptions<PlayerMp> {}

export class RagePlayer extends RageEntity<PlayerMp> implements IPlayer {
  public get name(): string {
    return this.mpEntity.name;
  }

  public get socialClub(): string {
    return this.mpEntity.socialClub;
  }

  public get heading(): number {
    return this.mpEntity.heading;
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
    return this.mpEntity.serial;
  }

  public get vehicle(): RageVehicle | null {
    const mpVehicle = this.mpEntity.vehicle;
    if (!mpVehicle) {
      return null;
    }

    return RockMod.instance.vehicles.getByID(mpVehicle.id) as RageVehicle;
  }

  public get seat(): number {
    return this.mpEntity.seat;
  }

  public get weapon(): number {
    return this.mpEntity.weapon;
  }

  public get weaponAmmo(): number {
    return this.mpEntity.weaponAmmo;
  }

  public get eyeColor(): number {
    return this.mpEntity.eyeColor;
  }

  public get streamedPlayers(): RagePlayer[] {
    const players: RagePlayer[] = [];

    for (const mpEntity of this.mpEntity.streamedPlayers) {
      players.push(RockMod.instance.players.getByID(mpEntity.id) as RagePlayer);
    }

    return players;
  }

  public constructor(options: IRagePlayerOptions) {
    super(options);
  }

  public emitEvent<K extends keyof IRageClientEvents>(eventName: K, ...args: Parameters<IRageClientEvents[K]>): void {
    return RockMod.instance.net.events.emitClient(this, eventName, ...args);
  }

  public emitRPC<K extends keyof IRageClientRPC>(
    rpcName: K,
    ...args: Parameters<IRageClientRPC[K]>
  ): Promise<ReturnType<IRageClientRPC[K]>> {
    return RockMod.instance.net.rpc.emitClient(this, rpcName, ...args);
  }

  public spawn(position: Vector3D): void {
    return this.mpEntity.spawn(new mp.Vector3(position));
  }

  public setName(name: string): void {
    this.mpEntity.name = name;
  }

  public setHeading(value: number): void {
    this.mpEntity.heading = value;
  }

  public setHealth(value: number): void {
    this.mpEntity.health = Math.clamp(value, 0, 100);
  }

  public setArmour(value: number): void {
    this.mpEntity.armour = Math.clamp(value, 0, 100);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    return this.mpEntity.setWeaponAmmo(mp.joaat(weapon), ammo);
  }

  public giveWeapon(weapon: string, ammo: number): void {
    return this.mpEntity.giveWeapon(weapon, ammo);
  }

  public removeWeapon(weapon: string): void {
    return this.mpEntity.removeWeapon(weapon);
  }

  public enableVoiceTo(player: RagePlayer): void {
    const mpPlayer = mp.players.at(player.id);
    return this.mpEntity.enableVoiceTo(mpPlayer);
  }

  public disableVoiceTo(player: RagePlayer): void {
    const mpPlayer = mp.players.at(player.id);
    return this.mpEntity.disableVoiceTo(mpPlayer);
  }

  public putIntoVehicle(vehicle: RageVehicle, seat?: number): void {
    const mpVehicle = mp.vehicles.at(vehicle.id);
    return this.mpEntity.putIntoVehicle(mpVehicle, seat || 0);
  }

  public ejectFromVehicle(): void {
    return this.mpEntity.removeFromVehicle();
  }

  public setCustomization(data: ICustomization): void {
    const {
      gender,
      shapeFirst,
      shapeSecond,
      shapeThird,
      skinFirst,
      skinSecond,
      skinThird,
      shapeMix,
      skinMix,
      thirdMix,
      eyeColor,
      hairColor,
      highlightColor,
      faceFeatures,
    } = data;

    return this.mpEntity.setCustomization(
      gender,
      shapeFirst,
      shapeSecond,
      shapeThird,
      skinFirst,
      skinSecond,
      skinThird,
      shapeMix,
      skinMix,
      thirdMix,
      eyeColor,
      hairColor,
      highlightColor,
      faceFeatures,
    );
  }

  public setHeadOverlay(
    overlayID: number,
    index: number,
    opacity: number,
    firstColor: number,
    secondColor: number,
  ): void {
    return this.mpEntity.setHeadOverlay(overlayID, [index, opacity, firstColor, secondColor]);
  }

  public setEyeColor(colorID: number): void {
    this.mpEntity.eyeColor = colorID;
  }

  public setProp(propID: number, drawableID: number, textureID: number): void {
    return this.mpEntity.setProp(propID, drawableID, textureID);
  }

  public setClothes(componentID: number, drawableID: number, textureID: number, paletteID: number): void {
    return this.mpEntity.setClothes(componentID, drawableID, textureID, paletteID);
  }

  public setHairColor(colorID: number, highlightColorID: number): void {
    return this.mpEntity.setHairColor(colorID, highlightColorID);
  }

  public kick(reason?: string): void {
    return this.mpEntity.kick(reason ?? "");
  }
}
