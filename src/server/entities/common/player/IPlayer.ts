import { IEntity, IEntityOptions } from "../entity/IEntity";
import { IVehicle } from "../vehicle/IVehicle";
import { IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { IServerToClientEvents } from "../../../../shared";
import { IClientRPCList } from "../../../../shared/net/common/rpc/types";

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

export interface IPlayer extends IEntity {
  get name(): string;
  get socialClub(): string;
  get heading(): number;
  get health(): number;
  get armour(): number;
  get isDead(): boolean;
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
}
