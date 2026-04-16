import { type IRageEntityOptions, RageEntity } from "../entity/RageEntity";
import { type IObject } from "@RockMod/client/entities";

export interface IRageObjectOptions extends IRageEntityOptions<ObjectMp> {}

export class RageObject extends RageEntity<ObjectMp> implements IObject {
  public constructor(options: IRageObjectOptions) {
    super(options);
  }

  public attachTo(
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
  ): void {
    this.mpEntity.attachTo(
      entity,
      boneIndex,
      xPos,
      yPos,
      zPos,
      xRot,
      yRot,
      zRot,
      false,
      useSoftPinning,
      collision,
      isPed,
      vertexIndex,
      fixedRot,
    );
  }

  public isAttachedTo(entity: number): boolean {
    return this.mpEntity.isAttachedTo(entity);
  }

  public detach(applyVelocy: boolean, collision: boolean): void {
    this.mpEntity.detach(applyVelocy, collision);
  }
}
