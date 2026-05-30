import { CCMPEntity } from "../entity/CCMPEntity";
import { type ICustomization, type IPlayer } from "../../common/player/IPlayer";
import { type CCMPVehicle } from "../vehicle/CCMPVehicle";
import { BaseObjectType, type IServerToClientEvents } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { MathClamp } from "../../../../shared/common/utils/math/Math";
import { RockMod } from "../../../RockMod";
import type { Player as CcmpPlayer } from "@classic-mp/types/server";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface ICCMPPlayerOptions {
  ccmpPlayer: CcmpPlayer;
}

export class CCMPPlayer extends CCMPEntity implements IPlayer {
  private readonly _ccmpPlayer: CcmpPlayer;

  public override get id(): number {
    return this._ccmpPlayer.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public override get isExists(): boolean {
    return ccmp.players.getById(this._ccmpPlayer.id) !== null;
  }

  public override get position(): IVector3D {
    const p = this._ccmpPlayer.position;
    if (!p) return new Vector3D(0, 0, 0);
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._ccmpPlayer.dimension;
  }

  public override get model(): number {
    return this._ccmpPlayer.model;
  }

  // CCMP exposes only heading; pitch/roll (x/y components) are silently dropped on setRotation.
  public override get rotation(): IVector3D {
    return new Vector3D(0, 0, this._ccmpPlayer.heading);
  }

  public get name(): string {
    return this._ccmpPlayer.name;
  }

  public get socialClub(): string {
    return this._ccmpPlayer.socialClub;
  }

  public get heading(): number {
    return this._ccmpPlayer.heading;
  }

  public get health(): number {
    return this._ccmpPlayer.health;
  }

  public get armour(): number {
    return this._ccmpPlayer.armour;
  }

  public get isDead(): boolean {
    return this._ccmpPlayer.health <= 0;
  }

  public get ip(): string {
    return notImplemented("CCMPPlayer.ip");
  }

  public get serial(): string {
    return notImplemented("CCMPPlayer.serial");
  }

  public get vehicle(): CCMPVehicle | null {
    const ccmpVehicle = this._ccmpPlayer.vehicle;
    if (!ccmpVehicle) return null;
    return RockMod.instance.vehicles.findByID(ccmpVehicle.id) as CCMPVehicle | null;
  }

  public get seat(): number {
    return this._ccmpPlayer.seat;
  }

  public get weapon(): number {
    return this._ccmpPlayer.currentWeapon;
  }

  public get weaponAmmo(): number {
    return this._ccmpPlayer.ammo;
  }

  protected override get ccmpMeta(): CcmpPlayer {
    return this._ccmpPlayer;
  }

  public get eyeColor(): number {
    return notImplemented("CCMPPlayer.eyeColor");
  }

  public get streamedPlayers(): CCMPPlayer[] {
    return notImplemented("CCMPPlayer.streamedPlayers");
  }

  public constructor(options: ICCMPPlayerOptions) {
    super();
    this._ccmpPlayer = options.ccmpPlayer;
  }

  public override destroy(): void {
    notImplemented("CCMPPlayer.destroy");
  }

  public override setPosition(value: IVector3D): void {
    this._ccmpPlayer.teleport(value.x, value.y, value.z);
  }

  public override setDimension(value: number): void {
    this._ccmpPlayer.dimension = value;
  }

  public override setModel(value: string): void {
    // CCMP runtime accepts a string and JOAATs server-side via op_set_player_model.
    this._ccmpPlayer.model = value as unknown as number;
  }

  public override setRotation(value: IVector3D): void {
    this._ccmpPlayer.heading = value.z;
  }

  public emitEvent<K extends keyof IServerToClientEvents>(
    eventName: K,
    ...args: Parameters<IServerToClientEvents[K]>
  ): void {
    return RockMod.instance.net.events.emitClient(this, eventName, ...args);
  }

  public emitRPC<K extends keyof IClientRPCList>(
    rpcName: K,
    ...args: Parameters<IClientRPCList[K]>
  ): Promise<ReturnType<IClientRPCList[K]>> {
    return RockMod.instance.net.rpc.emitClient(this, rpcName, ...args);
  }

  public spawn(_position: Vector3D): void {
    notImplemented("CCMPPlayer.spawn");
  }

  public setName(name: string): void {
    this._ccmpPlayer.name = name;
  }

  public setHeading(value: number): void {
    this._ccmpPlayer.heading = value;
  }

  public setHealth(value: number): void {
    this._ccmpPlayer.health = MathClamp(value, 0, 100);
  }

  public setArmour(value: number): void {
    this._ccmpPlayer.armour = MathClamp(value, 0, 100);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    this._ccmpPlayer.setWeaponAmmo(RockMod.instance.utils.hash(weapon), ammo);
  }

  public giveWeapon(weapon: string, ammo: number): void {
    this._ccmpPlayer.giveWeapon(RockMod.instance.utils.hash(weapon), ammo);
  }

  public removeWeapon(weapon: string): void {
    this._ccmpPlayer.removeWeapon(RockMod.instance.utils.hash(weapon));
  }

  public enableVoiceTo(_player: CCMPPlayer): void {
    notImplemented("CCMPPlayer.enableVoiceTo");
  }

  public disableVoiceTo(_player: CCMPPlayer): void {
    notImplemented("CCMPPlayer.disableVoiceTo");
  }

  public putIntoVehicle(vehicle: CCMPVehicle, seat?: number): void {
    this._ccmpPlayer.putIntoVehicle(vehicle.id, seat);
  }

  public ejectFromVehicle(): void {
    this._ccmpPlayer.removeFromVehicle();
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

  public playAnimation(dictionary: string, name: string, speed: number, flag: number): void {
    this._ccmpPlayer.playAnimation(dictionary, name, speed, flag);
  }

  public stopAnimation(): void {
    this._ccmpPlayer.stopAnimation();
  }

  public removeFromVehicle(): void {
    this._ccmpPlayer.removeFromVehicle();
  }
}
