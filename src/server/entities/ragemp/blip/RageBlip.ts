import { IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { IBlip, IBlipColor, IBlipSprite } from "../../common";

export interface IRageBlipOptions extends IRageWorldObjectOptions<EntityMp> {}

export class RageBlip extends RageWorldObject<EntityMp> implements IBlip {
  public get name(): string {
    return (this.mpEntity as unknown as BlipMp).name;
  }

  public get sprite(): IBlipSprite {
    return (this.mpEntity as unknown as BlipMp).sprite;
  }

  public get color(): IBlipColor {
    return (this.mpEntity as unknown as BlipMp).color;
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get scale(): number {
    return (this.mpEntity as unknown as BlipMp).scale;
  }

  public get drawDistance(): number {
    return (this.mpEntity as unknown as BlipMp).drawDistance;
  }

  public get shortRange(): boolean {
    return (this.mpEntity as unknown as BlipMp).shortRange;
  }

  public get rotation(): number {
    return (this.mpEntity as unknown as BlipMp).rotation;
  }

  public constructor(options: IRageBlipOptions) {
    super(options);
  }

  public setName(value: string): void {
    (this.mpEntity as unknown as BlipMp).name = value;
  }

  public setSprite(value: IBlipSprite): void {
    (this.mpEntity as unknown as BlipMp).sprite = value;
  }

  public setColor(value: IBlipColor): void {
    (this.mpEntity as unknown as BlipMp).color = value;
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }
}
