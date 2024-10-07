import { AltVWorldObject, IAltVWorldObjectOptions } from "../worldObject/AltVWorldObject";
import { IBlip, IBlipColor, IBlipSprite } from "../../common";
import BlipSprite = AltVShared.BlipSprite;

export interface IAltVBlipOptions extends IAltVWorldObjectOptions<AltVServer.Blip> {}

export class AltVBlip extends AltVWorldObject<AltVServer.Blip> implements IBlip {
  public get sprite(): IBlipSprite {
    return this.mpEntity.sprite as unknown as IBlipSprite;
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get name(): string {
    return this.mpEntity.name;
  }

  public get color(): IBlipColor {
    return this.mpEntity.color as IBlipColor;
  }

  public constructor(options: IAltVBlipOptions) {
    super(options);
  }

  public setSprite(value: IBlipSprite): void {
    this.mpEntity.sprite = value as unknown as BlipSprite;
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }

  public setName(value: string): void {
    this.mpEntity.name = value;
  }

  public setColor(value: IBlipColor): void {
    this.mpEntity.color = value;
  }
}
