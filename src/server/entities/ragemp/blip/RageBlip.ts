import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { IBlip, IBlipColor, IBlipSprite } from "../../common";

export interface IRageBlipOptions extends IRageWorldObjectOptions<EntityMp> {}

export class RageBlip extends RageWorldObject<EntityMp> implements IBlip {
  public get sprite(): IBlipSprite {
    return (this.mpEntity as unknown as BlipMp).sprite;
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get name(): string {
    return (this.mpEntity as unknown as BlipMp).name;
  }

  public get color(): IBlipColor {
    return (this.mpEntity as unknown as BlipMp).color;
  }

  public constructor(options: IRageBlipOptions) {
    super(options);
  }

  public setSprite(value: IBlipSprite): void {
    (this.mpEntity as unknown as BlipMp).sprite = value;
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }

  public setName(value: string): void {
    (this.mpEntity as unknown as BlipMp).name = value;
  }

  public setColor(value: IBlipColor): void {
    (this.mpEntity as unknown as BlipMp).color = value;
  }
}
