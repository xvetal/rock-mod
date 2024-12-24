import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IBlip } from "../../common/blip/IBlip";
import { type IBlipColor, type IBlipSprite } from "@shared/entities";

export interface IRageBlipOptions extends IRageWorldObjectOptions<EntityMp> {}

export class RageBlip extends RageWorldObject<EntityMp> implements IBlip {
  public get sprite(): IBlipSprite {
    return (this.mpEntity as unknown as BlipMp).getSprite();
  }

  public get color(): IBlipColor {
    return (this.mpEntity as unknown as BlipMp).getColour();
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get shortRange(): boolean {
    return (this.mpEntity as unknown as BlipMp).isShortRange();
  }

  public constructor(options: IRageBlipOptions) {
    super(options);
  }

  public setSprite(value: IBlipSprite): void {
    (this.mpEntity as unknown as BlipMp).setSprite(value);
  }

  public setColor(value: IBlipColor): void {
    (this.mpEntity as unknown as BlipMp).setColour(value);
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }
}
