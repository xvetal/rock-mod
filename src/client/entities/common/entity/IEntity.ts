import { type IWorldObject, type IWorldObjectOptions } from "../worldObject/IWorldObject";
import { type IVector3D } from "@shared/common/utils";

export interface IEntityOptions extends IWorldObjectOptions {}

export interface IEntity extends IWorldObject {
  get handle(): number;
  get model(): number;
  get rotation(): IVector3D;
  get heading(): number;
  setHeading(heading: number): void;
  setModel(value: string): void;
  setRotation(value: IVector3D): void;
  get forwardVector(): IVector3D;
  freezePosition(freeze: boolean): void;
  setCollision(collision: boolean, keepPhysics: boolean): void;
  setInvincible(invincible: boolean): void;
  setVisible(visible: boolean): void;
  setAlpha(alpha: number): void;
  get alpha(): number;
  resetAlpha(): void;
  getOffsetFromInWorldCoords(offsetX: number, offsetY: number, offsetZ: number): IVector3D;
  getBoneIndexByName(boneName: string): number;
  getWorldPositionOfBone(boneIndex: number): IVector3D;
}
