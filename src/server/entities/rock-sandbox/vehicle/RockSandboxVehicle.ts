import { type IVehicle } from "../../common/vehicle/IVehicle";
import { type IRGBA } from "../../../../shared/common/utils";
import { type IPlayer } from "../../common/player";
import { RockSandboxEntity } from "../entity/RockSandboxEntity";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

import { type RockSandboxVehicle as NativeVehicle } from "@rock-sandbox/types/server";
import { BaseObjectType } from "../../../../shared";
import { Vector3D, type IVector3D } from "../../../../shared/common/utils/math/Vectors";
import { wrapPlayer } from "../player/RockSandboxPlayer";
export class RockSandboxVehicle extends RockSandboxEntity implements IVehicle {
  public constructor(private readonly _nativeVehicle: NativeVehicle) {
    super();
  }

  public override getNetData(name: string): unknown {
    return this._nativeVehicle.getNetData(name);
  }

  public override setNetData(name: string, value: unknown): void {
    this._nativeVehicle.setNetData(name, value);
  }

  public override get id(): number {
    return this._nativeVehicle.id;
  }

  public override get type(): BaseObjectType {
    return BaseObjectType.Vehicle;
  }

  public override get isExists(): boolean {
    return this._nativeVehicle.isExists;
  }

  public override get model(): number {
    return this._nativeVehicle.modelHash;
  }

  public override get position(): IVector3D {
    const { x, y, z } = this._nativeVehicle.position;
    return new Vector3D(x, -z, y);
  }

  public override get rotation(): IVector3D {
    const { x, y, z } = this._nativeVehicle.rotation;
    return new Vector3D(x, -z, y);
  }

  public override get dimension(): number {
    return this._nativeVehicle.dimension;
  }

  public override setPosition(value: IVector3D): void {
    this._nativeVehicle.setPosition({ x: value.x, y: value.z, z: -value.y });
  }

  public override setRotation(value: IVector3D): void {
    this._nativeVehicle.setRotation({ x: value.x, y: value.z, z: -value.y });
  }

  public override setDimension(value: number): void {
    this._nativeVehicle.setDimension(value);
  }

  public override destroy(): void {
    this._nativeVehicle.destroy();
  }

  public get bodyHealth(): number {
    return this._nativeVehicle.bodyHealth;
  }

  public get engineHealth(): number {
    return this._nativeVehicle.engineHealth;
  }

  public get numberPlate(): string {
    return this._nativeVehicle.numberPlate;
  }

  public get isLocked(): boolean {
    return this._nativeVehicle.isLocked;
  }

  public get isDead(): boolean {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.isDead");
  }

  public get primaryColor(): number {
    return this._nativeVehicle.primaryColor ?? -1;
  }

  public get secondaryColor(): number {
    return this._nativeVehicle.secondaryColor ?? -1;
  }

  public get customPrimaryColor(): IRGBA | null {
    return this._nativeVehicle.customPrimaryColor;
  }

  public get customSecondaryColor(): IRGBA | null {
    return this._nativeVehicle.customSecondaryColor;
  }

  public get driver(): IPlayer | null {
    const player = this._nativeVehicle.driver;
    return player === null ? null : wrapPlayer(player);
  }

  public get passengers(): Set<IPlayer> {
    return new Set(this._nativeVehicle.passengers.map(wrapPlayer));
  }

  public setBodyHealth(value: number): void {
    this._nativeVehicle.setBodyHealth(value);
  }

  public setEngineHealth(value: number): void {
    this._nativeVehicle.setEngineHealth(value);
  }

  public setEngineOn(value: boolean): void {
    this._nativeVehicle.setEngineOn(value);
  }

  public setNumberPlate(value: string): void {
    this._nativeVehicle.setNumberPlate(value);
  }

  public setLocked(value: boolean): void {
    this._nativeVehicle.setLocked(value);
  }

  public setPrimaryColor(value: number): void {
    this._nativeVehicle.setPrimaryColor(value);
  }

  public setSecondaryColor(value: number): void {
    this._nativeVehicle.setSecondaryColor(value);
  }

  public setCustomPrimaryColor(value: IRGBA): void {
    this._nativeVehicle.setCustomPrimaryColor({ r: value.r, g: value.g, b: value.b, a: value.a ?? 255 });
  }

  public setCustomSecondaryColor(value: IRGBA): void {
    this._nativeVehicle.setCustomSecondaryColor({ r: value.r, g: value.g, b: value.b, a: value.a ?? 255 });
  }

  public setMod(_modType: number, _modIndex: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setMod");
  }

  public getMod(_modType: number): number {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.getMod");
  }

  public setNeonEnabled(_enabled: boolean): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setNeonEnabled");
  }

  public setNeonColor(_r: number, _g: number, _b: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setNeonColor");
  }

  public setWindowTint(_tintType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setWindowTint");
  }

  public setWheelType(_wheelType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setWheelType");
  }

  public setPlateType(_plateType: number): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.setPlateType");
  }

  public explode(): void {
    return rockSandboxNotImplemented("server", "RockSandboxVehicle.explode");
  }

  public repair(): void {
    this._nativeVehicle.repair();
  }
}

const wrappers = new WeakMap<NativeVehicle, RockSandboxVehicle>();
export function wrapVehicle(vehicle: NativeVehicle): RockSandboxVehicle {
  const old = wrappers.get(vehicle);
  if (old) return old;
  const wrapper = new RockSandboxVehicle(vehicle);
  wrappers.set(vehicle, wrapper);
  return wrapper;
}
