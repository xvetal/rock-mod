import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import { IBlip, IBlipColor, IBlipSprite } from "../../common";
import BlipSprite = AltVShared.BlipSprite;

export interface IAltVBlipOptions extends IAltVWorldObjectOptions<AltVServer.Blip> {}

export class AltVBlip extends AltVWorldObject<AltVServer.Blip> implements IBlip {
  public get name(): string {
    return this.mpEntity.name;
  }

  public get sprite(): IBlipSprite {
    return this.mpEntity.sprite as unknown as IBlipSprite;
  }

  public get color(): IBlipColor {
    return this.mpEntity.color as IBlipColor;
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get scale(): number {
    return this.mpEntity.scale;
  }

  public get drawDistance(): number {
    console.log("[RockMod] AltVBlip drawDistance is not implemented");
    return 0;
  }

  public get shortRange(): boolean {
    return this.mpEntity.shortRange;
  }

  public get rotation(): number {
    return this.mpEntity.heading;
  }

  public constructor(options: IAltVBlipOptions) {
    super(options);
  }

  public setName(value: string): void {
    this.mpEntity.name = value;
  }

  public setSprite(value: IBlipSprite): void {
    this.mpEntity.sprite = value as unknown as BlipSprite;
  }

  public setColor(value: IBlipColor): void {
    this.mpEntity.color = value;
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }
}
