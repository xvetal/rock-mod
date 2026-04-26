import { type IBaseObject } from "../baseObject";
import { type IWorldObject, type IWorldObjectOptions } from "../worldObject/IWorldObject";
import { type IVector3D } from "@shared/common/utils";

export interface IEntityOptions extends IWorldObjectOptions {}

export interface IEntity extends IWorldObject {
  get model(): number;
  get heading(): number;
  setHeading(heading: number): void;
  setModel(value: string): void;
  get rotation(): IVector3D;
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
  getVariable(name: string): unknown | null;

  attachToEntity(
    target: IBaseObject,
    boneIndex: number,
    offset: IVector3D,
    rotation: IVector3D,
    p9: boolean,
    useSoftPinning: boolean,
    collision: boolean,
    isPed: boolean,
    vertexIndex: number,
    fixedRot: boolean,
  ): void;
  detach(useDetachVelocity: boolean, collision: boolean): void;
  getSpeed(): number;
  isPlayingAnim(dictionary: string, name: string, taskFlag: number): boolean;
}
