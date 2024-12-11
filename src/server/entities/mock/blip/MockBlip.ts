import { MockWorldObject, IMockWorldObjectOptions } from "../worldObject/MockWorldObject";
import { IBlip } from "../../common";
import { IBlipColor, IBlipSprite } from "../../../../shared";

export interface IMockBlipOptions extends IMockWorldObjectOptions {
  alpha: number;
  color: number;
  drawDistance: number;
  name: string;
  rotation: number;
  scale: number;
  shortRange: boolean;
  sprite: number;
}

export class MockBlip extends MockWorldObject implements IBlip {
  private _name: string;

  private _sprite: IBlipSprite;

  private _color: IBlipColor;

  private _alpha: number;

  private readonly _scale: number;

  private readonly _drawDistance: number;

  private readonly _shortRange: boolean;

  private readonly _rotation: number;

  public get name(): string {
    return this._name;
  }

  public get sprite(): IBlipSprite {
    return this._sprite;
  }

  public get color(): IBlipColor {
    return this._color;
  }

  public get alpha(): number {
    return this._alpha;
  }

  public get scale(): number {
    return this._scale;
  }

  public get drawDistance(): number {
    return this._drawDistance;
  }

  public get shortRange(): boolean {
    return this._shortRange;
  }

  public get rotation(): number {
    return this._rotation;
  }

  public constructor(options: IMockBlipOptions) {
    super(options);

    this._name = options.name;
    this._sprite = options.sprite;
    this._color = options.color;
    this._alpha = options.alpha;
    this._scale = options.scale;
    this._drawDistance = options.drawDistance;
    this._shortRange = options.shortRange;
    this._rotation = options.rotation;
  }

  public setName(value: string): void {
    this._name = value;
  }

  public setSprite(value: IBlipSprite): void {
    this._sprite = value;
  }

  public setColor(value: IBlipColor): void {
    this._color = value;
  }

  public setAlpha(value: number): void {
    this._alpha = value;
  }
}
