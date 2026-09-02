import { VIMPEntity } from "../entity/VIMPEntity";
import { type ICustomization, type IPlayer } from "../../common/player/IPlayer";
import { type VIMPVehicle } from "../vehicle/VIMPVehicle";
import { BaseObjectType, type IServerToClientEvents } from "../../../../shared";
import { type IClientRPCList } from "../../../../shared/net/common/rpc/types";
import { type IVector3D, Vector3D } from "../../../../shared/common/utils/math/Vectors";
import { MathClamp } from "../../../../shared/common/utils/math/Math";
import { RockMod } from "../../../RockMod";
import type { Player as VimpPlayer } from "@vimp-mp/types/server";

const notImplemented = (name: string): never => {
  throw new Error(`Not implemented yet: ${name}`);
};

export interface IVIMPPlayerOptions {
  vimpPlayer: VimpPlayer;
}

export class VIMPPlayer extends VIMPEntity implements IPlayer {
  private readonly _vimpPlayer: VimpPlayer;

  public override get id(): number {
    return this._vimpPlayer.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Player;
  }

  public override get isExists(): boolean {
    return vimp.players.getById(this._vimpPlayer.id) !== null;
  }

  public override get position(): IVector3D {
    const p = this._vimpPlayer.position;
    if (!p) return new Vector3D(0, 0, 0);
    return new Vector3D(p.x, p.y, p.z);
  }

  public override get dimension(): number {
    return this._vimpPlayer.dimension;
  }

  public override get model(): number {
    return this._vimpPlayer.model;
  }

  // VIMP exposes only heading; pitch/roll (x/y components) are silently dropped on setRotation.
  public override get rotation(): IVector3D {
    return new Vector3D(0, 0, this._vimpPlayer.heading);
  }

  public get name(): string {
    return this._vimpPlayer.name;
  }

  public get socialClub(): string {
    return this._vimpPlayer.socialClub;
  }

  public get heading(): number {
    return this._vimpPlayer.heading;
  }

  public get health(): number {
    return this._vimpPlayer.health;
  }

  public get armour(): number {
    return this._vimpPlayer.armour;
  }

  public get isDead(): boolean {
    return this._vimpPlayer.health <= 0;
  }

  public get ip(): string {
    return notImplemented("VIMPPlayer.ip");
  }

  public get serial(): string {
    return notImplemented("VIMPPlayer.serial");
  }

  public get vehicle(): VIMPVehicle | null {
    const vimpVehicle = this._vimpPlayer.vehicle;
    if (!vimpVehicle) return null;
    return RockMod.instance.vehicles.findByID(vimpVehicle.id) as VIMPVehicle | null;
  }

  public get seat(): number {
    return this._vimpPlayer.seat;
  }

  public get weapon(): number {
    return this._vimpPlayer.currentWeapon;
  }

  public get weaponAmmo(): number {
    return this._vimpPlayer.ammo;
  }

  protected override get vimpMeta(): VimpPlayer {
    return this._vimpPlayer;
  }

  public get eyeColor(): number {
    return notImplemented("VIMPPlayer.eyeColor");
  }

  public get streamedPlayers(): VIMPPlayer[] {
    return notImplemented("VIMPPlayer.streamedPlayers");
  }

  public constructor(options: IVIMPPlayerOptions) {
    super();
    this._vimpPlayer = options.vimpPlayer;
  }

  public override destroy(): void {
    notImplemented("VIMPPlayer.destroy");
  }

  public override setPosition(value: IVector3D): void {
    this._vimpPlayer.teleport(value.x, value.y, value.z);
  }

  public override setDimension(value: number): void {
    this._vimpPlayer.dimension = value;
  }

  public override setModel(value: string): void {
    // VIMP runtime accepts a string and JOAATs server-side via op_set_player_model.
    this._vimpPlayer.model = value as unknown as number;
  }

  public override setRotation(value: IVector3D): void {
    this._vimpPlayer.heading = value.z;
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
    notImplemented("VIMPPlayer.spawn");
  }

  public setName(name: string): void {
    this._vimpPlayer.name = name;
  }

  public setHeading(value: number): void {
    this._vimpPlayer.heading = value;
  }

  public setHealth(value: number): void {
    this._vimpPlayer.health = MathClamp(value, 0, 100);
  }

  public setArmour(value: number): void {
    this._vimpPlayer.armour = MathClamp(value, 0, 100);
  }

  public setWeaponAmmo(weapon: string, ammo: number): void {
    this._vimpPlayer.setWeaponAmmo(RockMod.instance.utils.hash(weapon), ammo);
  }

  public giveWeapon(weapon: string, ammo: number): void {
    this._vimpPlayer.giveWeapon(RockMod.instance.utils.hash(weapon), ammo);
  }

  public removeWeapon(weapon: string): void {
    this._vimpPlayer.removeWeapon(RockMod.instance.utils.hash(weapon));
  }

  public enableVoiceTo(_player: VIMPPlayer): void {
    // VIMP routes proximity voice to the speaker's streaming observers
    // automatically. There is no per-listener allow-list to update here.
  }

  public disableVoiceTo(_player: VIMPPlayer): void {
    // VIMP removes observers from proximity voice routing automatically when
    // they leave the speaker's streaming range.
  }

  public putIntoVehicle(vehicle: VIMPVehicle, seat?: number): void {
    this._vimpPlayer.putIntoVehicle(vehicle.id, seat);
  }

  public ejectFromVehicle(): void {
    this._vimpPlayer.removeFromVehicle();
  }

  public setCustomization(_data: ICustomization): void {
    notImplemented("VIMPPlayer.setCustomization");
  }

  public setHeadOverlay(
    _overlayID: number,
    _index: number,
    _opacity: number,
    _firstColor: number,
    _secondColor: number,
  ): void {
    notImplemented("VIMPPlayer.setHeadOverlay");
  }

  public setEyeColor(_colorID: number): void {
    notImplemented("VIMPPlayer.setEyeColor");
  }

  public setProp(_propID: number, _drawableID: number, _textureID: number): void {
    notImplemented("VIMPPlayer.setProp");
  }

  public setClothes(_componentID: number, _drawableID: number, _textureID: number, _paletteID: number): void {
    notImplemented("VIMPPlayer.setClothes");
  }

  public setHairColor(_colorID: number, _highlightColorID: number): void {
    notImplemented("VIMPPlayer.setHairColor");
  }

  public kick(reason?: string): void {
    this._vimpPlayer.kick(reason ?? "");
  }

  public playAnimation(dictionary: string, name: string, speed: number, flag: number): void {
    this._vimpPlayer.playAnimation(dictionary, name, speed, flag);
  }

  public stopAnimation(): void {
    this._vimpPlayer.stopAnimation();
  }

  public removeFromVehicle(): void {
    this._vimpPlayer.removeFromVehicle();
  }
}
