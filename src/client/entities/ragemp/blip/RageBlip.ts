import { type IRageWorldObjectOptions, RageWorldObject } from "../worldObject/RageWorldObject";
import { type IBlip } from "../../common/blip/IBlip";
import { type IBlipColor, type IBlipSprite } from "@shared/entities";

export interface IRageBlipOptions extends IRageWorldObjectOptions<EntityMp> {}

export class RageBlip extends RageWorldObject<EntityMp> implements IBlip {
  private get _blipEntity(): BlipMp {
    return this.mpEntity as unknown as BlipMp;
  }

  public get sprite(): IBlipSprite {
    return this._blipEntity.getSprite();
  }

  public get color(): IBlipColor {
    return this._blipEntity.getColour();
  }

  public get alpha(): number {
    return this.mpEntity.alpha;
  }

  public get shortRange(): boolean {
    return this._blipEntity.isShortRange();
  }

  public constructor(options: IRageBlipOptions) {
    super(options);
  }

  public setSprite(value: IBlipSprite): void {
    this._blipEntity.setSprite(value);
  }

  public setColor(value: IBlipColor): void {
    this._blipEntity.setColour(value);
  }

  public setAlpha(value: number): void {
    this.mpEntity.alpha = value;
  }

  public setShowHeadingIndicator(value: boolean): void {
    this._blipEntity.setShowHeadingIndicator(value);
  }

  public setRotation(value: number): void {
    this._blipEntity.setRotation(value);
  }
}
