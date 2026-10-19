import { type IEntity } from "../../common/entity/IEntity";
import { type IBaseObject } from "../../common/baseObject";
import { type IVector3D } from "../../../../shared/common/utils";
import { RockSandboxWorldObject } from "../worldObject/RockSandboxWorldObject";
import { rockSandboxNotImplemented } from "../../../../shared/internal/rockSandboxNotImplemented";

export class RockSandboxEntity extends RockSandboxWorldObject implements IEntity {
  public get model(): number {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.model");
  }

  public get heading(): number {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.heading");
  }

  public setHeading(_heading: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setHeading");
  }

  public setModel(_value: string): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setModel");
  }

  public get rotation(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.rotation");
  }

  public setRotation(_value: IVector3D): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setRotation");
  }

  public get forwardVector(): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.forwardVector");
  }

  public freezePosition(_freeze: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.freezePosition");
  }

  public setCollision(_collision: boolean, _keepPhysics: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setCollision");
  }

  public setInvincible(_invincible: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setInvincible");
  }

  public setVisible(_visible: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setVisible");
  }

  public setAlpha(_alpha: number): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.setAlpha");
  }

  public get alpha(): number {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.alpha");
  }

  public resetAlpha(): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.resetAlpha");
  }

  public getOffsetFromInWorldCoords(_offsetX: number, _offsetY: number, _offsetZ: number): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getOffsetFromInWorldCoords");
  }

  public getBoneIndexByName(_boneName: string): number {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getBoneIndexByName");
  }

  public getWorldPositionOfBone(_boneIndex: number): IVector3D {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getWorldPositionOfBone");
  }

  public getVariable(_name: string): unknown | null {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getVariable");
  }

  public getSyncedMeta(_key: string): unknown | undefined {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getSyncedMeta");
  }

  public hasSyncedMeta(_key: string): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.hasSyncedMeta");
  }

  public getSyncedMetaKeys(): readonly string[] {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getSyncedMetaKeys");
  }

  public attachToEntity(
    _target: IBaseObject,
    _boneIndex: number,
    _offset: IVector3D,
    _rotation: IVector3D,
    _p9: boolean,
    _useSoftPinning: boolean,
    _collision: boolean,
    _isPed: boolean,
    _vertexIndex: number,
    _fixedRot: boolean,
  ): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.attachToEntity");
  }

  public detach(_useDetachVelocity: boolean, _collision: boolean): void {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.detach");
  }

  public getSpeed(): number {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.getSpeed");
  }

  public isPlayingAnim(_dictionary: string, _name: string, _taskFlag: number): boolean {
    return rockSandboxNotImplemented("client", "RockSandboxEntity.isPlayingAnim");
  }
}
