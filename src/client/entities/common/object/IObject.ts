import { type IEntity, type IEntityOptions } from "../entity";

export interface IObjectOptions extends IEntityOptions {}

export interface IObject extends IEntity {
  attachTo(
    entity: Handle,
    boneIndex: number,
    xPos: number,
    yPos: number,
    zPos: number,
    xRot: number,
    yRot: number,
    zRot: number,
    useSoftPinning: boolean,
    collision: boolean,
    isPed: boolean,
    vertexIndex: number,
    fixedRot: boolean,
  ): void;
  isAttachedTo(entity: number): boolean;
  detach(applyVelocy: boolean, collision: boolean): void;
}
